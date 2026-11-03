// Framework-independent engine and effects from react-rewards 3.0.0.
// React hook removed. MIT license: rewards.LICENSE.
const defineEffect = (definition)=>Object.freeze({
        ...definition,
        defaults: Object.freeze({
            ...definition.defaults
        })
    });
const resolveConfig = (effect, overrides = {})=>{
    const config = {
        ...effect.defaults
    };
    for (const key of Object.keys(overrides)){
        const value = overrides[key];
        if (void 0 !== value) config[key] = value;
    }
    return config;
};
const createPacker = (initialWidth, initialHeight, padding)=>{
    let width = initialWidth;
    let height = initialHeight;
    const shelves = [];
    let bottom = padding;
    return {
        get width () {
            return width;
        },
        get height () {
            return height;
        },
        pack: (boxWidth, boxHeight)=>{
            const cellWidth = boxWidth + padding;
            const cellHeight = boxHeight + padding;
            for (const shelf of shelves)if (shelf.height >= cellHeight && shelf.height <= 2 * cellHeight && shelf.x + cellWidth <= width) {
                const point = {
                    x: shelf.x,
                    y: shelf.y
                };
                shelf.x += cellWidth;
                return point;
            }
            if (padding + cellWidth > width || bottom + cellHeight > height) return;
            shelves.push({
                y: bottom,
                height: cellHeight,
                x: padding + cellWidth
            });
            const point = {
                x: padding,
                y: bottom
            };
            bottom += cellHeight;
            return point;
        },
        grow: (nextWidth, nextHeight)=>{
            width = Math.max(width, nextWidth);
            height = Math.max(height, nextHeight);
        }
    };
};
const EMOJI_BOX = 1.25;
const EMOJI_FONT = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
const spriteSize = (source)=>{
    if ('emoji' in source) {
        const side = source.size * EMOJI_BOX;
        return {
            width: side,
            height: side
        };
    }
    if ('shape' in source && 'circle' === source.shape) return {
        width: source.size,
        height: source.size
    };
    return {
        width: source.width,
        height: source.height
    };
};
const spriteKey = (source)=>{
    const { width, height } = spriteSize(source);
    const size = `${width}x${height}`;
    if ('shape' in source) return `${source.shape}|${source.color}|${size}`;
    if ('emoji' in source) return `emoji|${source.emoji}|${size}`;
    if ('svg' in source) return `svg|${source.svg}|${size}`;
    return `draw|${source.key}|${size}`;
};
const drawSprite = (ctx, source, image)=>{
    const { width, height } = spriteSize(source);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.clip();
    if ('shape' in source) {
        ctx.fillStyle = source.color;
        if ('rect' === source.shape) ctx.fillRect(0, 0, width, height);
        else {
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, width / 2, 0, 2 * Math.PI);
            ctx.fill();
        }
    } else if ('emoji' in source) {
        ctx.font = `${source.size}px ${EMOJI_FONT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(source.emoji, width / 2, height / 2);
    } else if ('svg' in source) {
        if (image) ctx.drawImage(image, 0, 0, width, height);
    } else source.draw(ctx, width, height);
    ctx.restore();
};
const loadSvgImage = async (svg)=>{
    const image = new Image();
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    await image.decode();
    return image;
};
const PADDING = 2;
const createDomCanvas = (width, height)=>{
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
};
const context2d = (canvas)=>{
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('The sprite atlas needs a 2D canvas context.');
    return ctx;
};
const createAtlas = (options = {})=>{
    const { createCanvas = createDomCanvas, loadImage = loadSvgImage, initialSize = 256, maxSize = 2048 } = options;
    let canvas;
    let packer = createPacker(initialSize, initialSize, PADDING);
    let version = 0;
    const regions = new Map();
    const pending = new Map();
    const currentCanvas = ()=>{
        canvas ??= createCanvas(initialSize, initialSize);
        return canvas;
    };
    const grow = ()=>{
        const side = Math.max(packer.width, packer.height);
        if (side >= maxSize) return false;
        const next = createCanvas(Math.min(2 * side, maxSize), Math.min(2 * side, maxSize));
        context2d(next).drawImage(currentCanvas(), 0, 0);
        canvas = next;
        packer.grow(next.width, next.height);
        version += 1;
        return true;
    };
    const place = (source, dpr, image)=>{
        const { width, height } = spriteSize(source);
        const sw = Math.ceil(width * dpr);
        const sh = Math.ceil(height * dpr);
        if (sw + 2 * PADDING > maxSize || sh + 2 * PADDING > maxSize) throw new RangeError(`A ${sw}x${sh} px sprite does not fit a ${maxSize} px atlas.`);
        let point = packer.pack(sw, sh);
        while(!point){
            if (!grow()) throw new RangeError('The sprite atlas is full.');
            point = packer.pack(sw, sh);
        }
        const ctx = context2d(currentCanvas());
        ctx.setTransform(dpr, 0, 0, dpr, point.x, point.y);
        drawSprite(ctx, source, image);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        version += 1;
        return {
            sx: point.x,
            sy: point.y,
            sw,
            sh,
            width,
            height
        };
    };
    const loadOne = (source, dpr)=>{
        const key = `${spriteKey(source)}@${dpr}`;
        const cached = regions.get(key);
        if (cached) return cached;
        if (!('svg' in source)) {
            const region = place(source, dpr);
            regions.set(key, region);
            return region;
        }
        const inFlight = pending.get(key);
        if (inFlight) return inFlight;
        const promise = loadImage(source.svg).then((image)=>{
            const region = place(source, dpr, image);
            regions.set(key, region);
            return region;
        }).finally(()=>{
            if (pending.get(key) === promise) pending.delete(key);
        });
        pending.set(key, promise);
        return promise;
    };
    return {
        get canvas () {
            return currentCanvas();
        },
        get version () {
            return version;
        },
        load: (sources, dpr)=>{
            try {
                return Promise.all(sources.map((source)=>loadOne(source, dpr)));
            } catch (error) {
                return Promise.reject(error);
            }
        },
        clear: ()=>{
            regions.clear();
            pending.clear();
            packer = createPacker(initialSize, initialSize, PADDING);
            canvas = void 0;
            version += 1;
        }
    };
};
const MAX_DT = 1 / 30;
const createLoop = (scheduler, maxDt = MAX_DT)=>{
    const callbacks = new Set();
    let handle;
    let lastTime;
    const frame = (time)=>{
        handle = scheduler.request(frame);
        const elapsed = void 0 === lastTime ? 0 : (time - lastTime) / 1000;
        const dt = Math.min(Math.max(elapsed, 0), maxDt);
        lastTime = time;
        for (const callback of [
            ...callbacks
        ])if (callbacks.has(callback)) callback(dt);
    };
    return {
        get running () {
            return void 0 !== handle;
        },
        add: (callback)=>{
            callbacks.add(callback);
            if (void 0 === handle) {
                lastTime = void 0;
                handle = scheduler.request(frame);
            }
            return ()=>{
                if (!callbacks.delete(callback)) return;
                if (0 === callbacks.size && void 0 !== handle) {
                    scheduler.cancel(handle);
                    handle = void 0;
                }
            };
        }
    };
};
let shared;
const getLoop = ()=>{
    shared ??= createLoop({
        request: (callback)=>requestAnimationFrame(callback),
        cancel: (handle)=>cancelAnimationFrame(handle)
    });
    return shared;
};
const QUERY = '(prefers-reduced-motion: reduce)';
const prefersReducedMotion = ()=>'function' == typeof matchMedia && matchMedia(QUERY).matches;
const centre = (target)=>{
    const box = target.getBoundingClientRect();
    return {
        x: box.left + box.width / 2,
        y: box.top + box.height / 2
    };
};
const resolveOrigin = (origin)=>{
    if ('getBoundingClientRect' in origin) return centre(origin);
    if ('current' in origin) return origin.current ? centre(origin.current) : void 0;
    return {
        x: origin.x,
        y: origin.y
    };
};
const createCanvasRenderer = (canvas, ctx)=>{
    let dpr = 1;
    const clear = ()=>{
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    return {
        kind: 'canvas',
        canvas,
        resize: (width, height, ratio)=>{
            dpr = ratio;
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
        },
        draw: ({ atlas, batches })=>{
            clear();
            const image = atlas.canvas;
            for (const { pool, regions, blend } of batches){
                ctx.globalCompositeOperation = 'additive' === blend ? 'lighter' : 'source-over';
                const { x, y, rotation, scale, scaleX, scaleY, alpha, sprite } = pool.fields;
                for(let i = 0; i < pool.count; i++){
                    const opacity = alpha[i] ?? 0;
                    const region = regions[(sprite[i] ?? 0) | 0];
                    if (opacity <= 0 || !region) continue;
                    const size = (scale[i] ?? 0) * dpr;
                    const kx = size * (scaleX[i] ?? 0);
                    const ky = size * (scaleY[i] ?? 0);
                    if (0 === kx || 0 === ky) continue;
                    const angle = rotation[i] ?? 0;
                    const cos = Math.cos(angle);
                    const sin = Math.sin(angle);
                    ctx.globalAlpha = Math.min(opacity, 1);
                    ctx.setTransform(cos * kx, sin * kx, -sin * ky, cos * ky, (x[i] ?? 0) * dpr, (y[i] ?? 0) * dpr);
                    ctx.drawImage(image, region.sx, region.sy, region.sw, region.sh, -region.width / 2, -region.height / 2, region.width, region.height);
                }
            }
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'source-over';
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        },
        clear,
        dispose: ()=>{
            clear();
            canvas.width = 0;
            canvas.height = 0;
        }
    };
};
const INSTANCE_FLOATS = 11;
const createInstances = (initialCapacity = 256)=>{
    let data = new Float32Array(Math.max(1, Math.floor(initialCapacity)) * INSTANCE_FLOATS);
    let count = 0;
    const runs = [];
    const spare = [];
    const reserve = (needed)=>{
        if (needed * INSTANCE_FLOATS <= data.length) return;
        let capacity = data.length / INSTANCE_FLOATS;
        while(capacity < needed)capacity *= 2;
        const next = new Float32Array(capacity * INSTANCE_FLOATS);
        next.set(data.subarray(0, count * INSTANCE_FLOATS));
        data = next;
    };
    const write = (batches)=>{
        count = 0;
        runs.length = 0;
        for (const { pool, regions, blend } of batches){
            reserve(count + pool.count);
            const start = count;
            const { x, y, rotation, scale, scaleX, scaleY, alpha, sprite } = pool.fields;
            for(let i = 0; i < pool.count; i++){
                const opacity = alpha[i] ?? 0;
                const region = regions[(sprite[i] ?? 0) | 0];
                if (opacity <= 0 || !region || 0 === region.sw || 0 === region.sh) continue;
                const size = scale[i] ?? 0;
                const kx = size * (scaleX[i] ?? 0);
                const ky = size * (scaleY[i] ?? 0);
                if (0 === kx || 0 === ky) continue;
                const ux = kx * region.width / region.sw;
                const uy = ky * region.height / region.sh;
                const angle = rotation[i] ?? 0;
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                const o = count * INSTANCE_FLOATS;
                data[o] = x[i] ?? 0;
                data[o + 1] = y[i] ?? 0;
                data[o + 2] = Math.min(opacity, 1);
                data[o + 3] = cos * ux;
                data[o + 4] = sin * ux;
                data[o + 5] = -sin * uy;
                data[o + 6] = cos * uy;
                data[o + 7] = region.sx;
                data[o + 8] = region.sy;
                data[o + 9] = region.sw;
                data[o + 10] = region.sh;
                count += 1;
            }
            const written = count - start;
            if (0 === written) continue;
            const last = runs[runs.length - 1];
            if (last?.blend === blend) {
                last.count += written;
                continue;
            }
            let run = spare[runs.length];
            if (!run) {
                run = {
                    blend,
                    start,
                    count: 0
                };
                spare.push(run);
            }
            run.blend = blend;
            run.start = start;
            run.count = written;
            runs.push(run);
        }
    };
    return {
        get data () {
            return data;
        },
        get count () {
            return count;
        },
        runs,
        write
    };
};
const VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec3 a_center;
layout(location = 1) in vec4 a_axes;
layout(location = 2) in vec4 a_rect;
uniform vec2 u_view;
uniform vec2 u_texel;
out vec2 v_uv;
out float v_alpha;
const float MARGIN = 1.0;
void main() {
  vec2 corner = vec2(gl_VertexID & 1, gl_VertexID >> 1) * 2.0 - 1.0;
  vec2 offset = corner * (a_rect.zw * 0.5 + MARGIN);
  vec2 position = a_center.xy + mat2(a_axes) * offset;
  gl_Position = vec4(position * u_view + vec2(-1.0, 1.0), 0.0, 1.0);
  v_uv = (a_rect.xy + a_rect.zw * 0.5 + offset) * u_texel;
  v_alpha = a_center.z;
}
`;
const FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform sampler2D u_atlas;
in vec2 v_uv;
in float v_alpha;
out vec4 color;
void main() {
  color = texture(u_atlas, v_uv) * v_alpha;
}
`;
const compile = (gl, type, source)=>{
    const shader = gl.createShader(type);
    if (!shader) throw new Error('WebGL could not create a shader.');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
};
const createProgram = (gl)=>{
    const program = gl.createProgram();
    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const log = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(`The sprite program failed to link: ${log}`);
    }
    return program;
};
const STRIDE = 44;
const ATTRIBUTES = [
    [
        0,
        3,
        0
    ],
    [
        1,
        4,
        3
    ],
    [
        2,
        4,
        7
    ]
];
const CONTEXT_ATTRIBUTES = {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false
};
const createWebglRenderer = (canvas, gl, onLost)=>{
    const program = createProgram(gl);
    const view = gl.getUniformLocation(program, 'u_view');
    const texel = gl.getUniformLocation(program, 'u_texel');
    const vao = gl.createVertexArray();
    const buffer = gl.createBuffer();
    const texture = gl.createTexture();
    const instances = createInstances();
    let dpr = 1;
    let uploaded = -1;
    let lost = false;
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    for (const [location] of ATTRIBUTES){
        gl.enableVertexAttribArray(location);
        gl.vertexAttribDivisor(location, 1);
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.enable(gl.BLEND);
    gl.clearColor(0, 0, 0, 0);
    const handleLost = ()=>{
        lost = true;
        onLost?.();
    };
    canvas.addEventListener('webglcontextlost', handleLost);
    const point = (start)=>{
        for (const [location, size, offset] of ATTRIBUTES)gl.vertexAttribPointer(location, size, gl.FLOAT, false, STRIDE, start * STRIDE + 4 * offset);
    };
    const clear = ()=>{
        gl.clear(gl.COLOR_BUFFER_BIT);
    };
    return {
        kind: 'webgl',
        canvas,
        resize: (width, height, ratio)=>{
            dpr = ratio;
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        },
        draw: ({ atlas, batches })=>{
            if (lost) return;
            clear();
            instances.write(batches);
            if (0 === instances.count) return;
            if (atlas.version !== uploaded) {
                const image = atlas.canvas;
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.uniform2f(texel, 1 / image.width, 1 / image.height);
                uploaded = atlas.version;
            }
            gl.uniform2f(view, 2 * dpr / canvas.width, -2 * dpr / canvas.height);
            gl.bufferData(gl.ARRAY_BUFFER, instances.data, gl.DYNAMIC_DRAW, 0, 11 * instances.count);
            for (const run of instances.runs){
                if ('additive' === run.blend) gl.blendFunc(gl.ONE, gl.ONE);
                else gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                point(run.start);
                gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, run.count);
            }
        },
        clear: ()=>{
            if (!lost) clear();
        },
        dispose: ()=>{
            canvas.removeEventListener('webglcontextlost', handleLost);
            gl.deleteBuffer(buffer);
            gl.deleteTexture(texture);
            gl.deleteVertexArray(vao);
            gl.deleteProgram(program);
            gl.getExtension('WEBGL_lose_context')?.loseContext();
            canvas.width = 0;
            canvas.height = 0;
        }
    };
};
const factories = {
    webgl: (canvas, onLost)=>{
        const gl = canvas.getContext('webgl2', CONTEXT_ATTRIBUTES);
        if (!gl) return;
        try {
            return createWebglRenderer(canvas, gl, onLost);
        } catch  {
            gl.getExtension('WEBGL_lose_context')?.loseContext();
            return;
        }
    },
    canvas: (canvas)=>{
        const ctx = canvas.getContext('2d');
        return ctx ? createCanvasRenderer(canvas, ctx) : void 0;
    }
};
const select_createRenderer = (preference, createCanvas, onLost = ()=>{})=>{
    const kinds = 'auto' === preference ? [
        'webgl',
        'canvas'
    ] : [
        preference
    ];
    for (const kind of kinds){
        const renderer = factories[kind](createCanvas(), onLost);
        if (renderer) return renderer;
    }
};
const IDLE_TIMEOUT = 5000;
const STYLE = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;';
const createDefaultCanvas = ()=>document.createElement('canvas');
const createOverlay = (options = {})=>{
    const { createRenderer = (createCanvas, onLost)=>select_createRenderer('auto', createCanvas, onLost), idleTimeout = IDLE_TIMEOUT, onUnmount } = options;
    const leases = new Set();
    let canvas;
    let renderer;
    let observer;
    let idleTimer;
    let size = '';
    let stale = false;
    const resize = ()=>{
        if (!canvas || !renderer) return;
        const { width, height } = canvas.getBoundingClientRect();
        if (0 === width || 0 === height) return;
        const dpr = window.devicePixelRatio || 1;
        const next = `${width}x${height}@${dpr}`;
        if (next === size) return;
        size = next;
        renderer.resize(width, height, dpr);
    };
    const mount = ()=>{
        const created = createRenderer(createDefaultCanvas, ()=>{
            if (renderer === created) lose();
        });
        if (!created) return;
        const element = created.canvas;
        element.setAttribute('aria-hidden', 'true');
        element.style.cssText = STYLE;
        document.body.appendChild(element);
        canvas = element;
        renderer = created;
        if ('function' == typeof ResizeObserver) {
            observer = new ResizeObserver(resize);
            observer.observe(element);
        }
        return created;
    };
    const unmount = ()=>{
        idleTimer = void 0;
        observer?.disconnect();
        renderer?.dispose();
        canvas?.remove();
        observer = void 0;
        renderer = void 0;
        canvas = void 0;
        size = '';
        stale = false;
        onUnmount?.();
    };
    const lose = ()=>{
        const lost = [
            ...leases
        ];
        leases.clear();
        clearTimeout(idleTimer);
        unmount();
        for (const lease of lost)lease.onLost?.();
    };
    const highestZ = ()=>Math.max(...[
            ...leases
        ].map((lease)=>lease.zIndex));
    const release = (lease)=>{
        if (!leases.delete(lease) || !canvas) return;
        if (leases.size > 0) {
            canvas.style.zIndex = String(highestZ());
            return;
        }
        if (stale) return void unmount();
        renderer?.clear();
        canvas.style.display = 'none';
        idleTimer = setTimeout(unmount, idleTimeout);
    };
    return {
        acquire: (zIndex, onLost)=>{
            clearTimeout(idleTimer);
            idleTimer = void 0;
            const current = renderer ?? mount();
            if (!current || !canvas) return;
            const lease = {
                zIndex,
                onLost
            };
            leases.add(lease);
            canvas.style.display = '';
            canvas.style.zIndex = String(highestZ());
            resize();
            return {
                renderer: current,
                release: ()=>release(lease)
            };
        },
        reset: ()=>{
            if (!renderer) return;
            if (leases.size > 0) {
                stale = true;
                return;
            }
            clearTimeout(idleTimer);
            unmount();
        }
    };
};
const randomSeed = ()=>Math.floor(Math.random() * 2 ** 32);
const createRng = (seed = randomSeed())=>{
    let state = 0 | seed;
    const next = ()=>{
        state = state + 0x6d2b79f5 | 0;
        let t = Math.imul(state ^ state >>> 15, 1 | state);
        t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
        return ((t ^ t >>> 14) >>> 0) / 2 ** 32;
    };
    return {
        seed,
        next,
        range: (min, max)=>min + next() * (max - min),
        int: (min, max)=>min + Math.floor(next() * (max - min)),
        pick: (items)=>{
            if (0 === items.length) throw new RangeError('pick() needs at least one item.');
            return items[Math.floor(next() * items.length)];
        }
    };
};
const FIELDS = [
    'x',
    'y',
    'vx',
    'vy',
    'rotation',
    'scale',
    'scaleX',
    'scaleY',
    'alpha',
    'sprite',
    'age',
    'life',
    's0',
    's1',
    's2',
    's3'
];
const DEFAULTS = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rotation: 0,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    alpha: 1,
    sprite: 0,
    age: 0,
    life: 0,
    s0: 0,
    s1: 0,
    s2: 0,
    s3: 0
};
const allocateFields = (capacity)=>Object.fromEntries(FIELDS.map((field)=>[
            field,
            new Float32Array(capacity)
        ]));
const createPool = (initialCapacity = 64)=>{
    let capacity = Math.max(1, Math.floor(initialCapacity));
    let count = 0;
    const fields = allocateFields(capacity);
    const grow = ()=>{
        capacity *= 2;
        for (const field of FIELDS){
            const next = new Float32Array(capacity);
            next.set(fields[field]);
            fields[field] = next;
        }
    };
    return {
        get count () {
            return count;
        },
        get capacity () {
            return capacity;
        },
        fields,
        alloc: ()=>{
            if (count === capacity) grow();
            const index = count;
            count += 1;
            for (const field of FIELDS)fields[field][index] = DEFAULTS[field];
            return index;
        },
        free: (index)=>{
            if (!Number.isInteger(index) || index < 0 || index >= count) throw new RangeError(`No live particle at index ${index}.`);
            const last = count - 1;
            if (index !== last) for (const field of FIELDS){
                const values = fields[field];
                values[index] = values[last] ?? 0;
            }
            count = last;
        },
        clear: ()=>{
            count = 0;
        }
    };
};
class ParticleView {
    index = 0;
    pool;
    constructor(pool){
        this.pool = pool;
    }
    get x() {
        return this.pool.fields.x[this.index] ?? 0;
    }
    set x(value) {
        this.pool.fields.x[this.index] = value;
    }
    get y() {
        return this.pool.fields.y[this.index] ?? 0;
    }
    set y(value) {
        this.pool.fields.y[this.index] = value;
    }
    get vx() {
        return this.pool.fields.vx[this.index] ?? 0;
    }
    set vx(value) {
        this.pool.fields.vx[this.index] = value;
    }
    get vy() {
        return this.pool.fields.vy[this.index] ?? 0;
    }
    set vy(value) {
        this.pool.fields.vy[this.index] = value;
    }
    get rotation() {
        return this.pool.fields.rotation[this.index] ?? 0;
    }
    set rotation(value) {
        this.pool.fields.rotation[this.index] = value;
    }
    get scale() {
        return this.pool.fields.scale[this.index] ?? 0;
    }
    set scale(value) {
        this.pool.fields.scale[this.index] = value;
    }
    get scaleX() {
        return this.pool.fields.scaleX[this.index] ?? 0;
    }
    set scaleX(value) {
        this.pool.fields.scaleX[this.index] = value;
    }
    get scaleY() {
        return this.pool.fields.scaleY[this.index] ?? 0;
    }
    set scaleY(value) {
        this.pool.fields.scaleY[this.index] = value;
    }
    get alpha() {
        return this.pool.fields.alpha[this.index] ?? 0;
    }
    set alpha(value) {
        this.pool.fields.alpha[this.index] = value;
    }
    get sprite() {
        return this.pool.fields.sprite[this.index] ?? 0;
    }
    set sprite(value) {
        this.pool.fields.sprite[this.index] = value;
    }
    get age() {
        return this.pool.fields.age[this.index] ?? 0;
    }
    get life() {
        return this.pool.fields.life[this.index] ?? 0;
    }
    set life(value) {
        this.pool.fields.life[this.index] = value;
    }
    get s0() {
        return this.pool.fields.s0[this.index] ?? 0;
    }
    set s0(value) {
        this.pool.fields.s0[this.index] = value;
    }
    get s1() {
        return this.pool.fields.s1[this.index] ?? 0;
    }
    set s1(value) {
        this.pool.fields.s1[this.index] = value;
    }
    get s2() {
        return this.pool.fields.s2[this.index] ?? 0;
    }
    set s2(value) {
        this.pool.fields.s2[this.index] = value;
    }
    get s3() {
        return this.pool.fields.s3[this.index] ?? 0;
    }
    set s3(value) {
        this.pool.fields.s3[this.index] = value;
    }
}
const createSimulation = (effect, config, options)=>{
    const rng = createRng(options.seed);
    const count = Math.max(0, Math.floor(config.count));
    const life = config.lifetime / 1000;
    const pool = createPool(count);
    const { fields } = pool;
    const current = new ParticleView(pool);
    const child = new ParticleView(pool);
    const add = (x, y)=>{
        const index = pool.alloc();
        fields.x[index] = x;
        fields.y[index] = y;
        fields.life[index] = life;
        return index;
    };
    const context = {
        rng,
        spawn: (init)=>{
            child.index = add(current.x, current.y);
            init(child);
        }
    };
    for(let i = 0; i < count; i++){
        current.index = add(options.origin.x, options.origin.y);
        effect.spawn(current, config, rng, i);
    }
    return {
        pool,
        rng,
        get done () {
            return 0 === pool.count;
        },
        step: (dt)=>{
            for(let i = pool.count - 1; i >= 0; i--){
                fields.age[i] = (fields.age[i] ?? 0) + dt;
                const vx = fields.vx[i] ?? 0;
                const vy = fields.vy[i] ?? 0;
                current.index = i;
                effect.update(current, dt, config, context);
                fields.x[i] = (fields.x[i] ?? 0) + (vx + (fields.vx[i] ?? 0)) / 2 * dt;
                fields.y[i] = (fields.y[i] ?? 0) + (vy + (fields.vy[i] ?? 0)) / 2 * dt;
                if ((fields.age[i] ?? 0) >= (fields.life[i] ?? 0)) pool.free(i);
            }
        }
    };
};
const DEFAULT_Z_INDEX = 2147483647;
const pixelRatio = ()=>globalThis.devicePixelRatio || 1;
const createStage = ({ loop, overlay, atlas })=>{
    const running = new Set();
    const batches = [];
    let stop;
    const frame = (dt)=>{
        for (const burst of running){
            try {
                burst.simulation.step(dt);
            } catch  {
                burst.end('complete');
                continue;
            }
            if (burst.simulation.done) burst.end('complete');
        }
        batches.length = 0;
        let renderer;
        for (const burst of running){
            batches.push(burst.batch);
            renderer = burst.renderer;
        }
        renderer?.draw({
            atlas,
            batches
        });
    };
    const fire = (effect, options)=>{
        let resolve = ()=>{};
        const finished = new Promise((settle)=>{
            resolve = settle;
        });
        let ended = false;
        let release;
        let entry;
        const end = (how)=>{
            if (ended) return;
            ended = true;
            if (entry) {
                running.delete(entry);
                if (0 === running.size) {
                    stop?.();
                    stop = void 0;
                }
            }
            release?.();
            const { onComplete } = options;
            if (onComplete && 'cancelled' !== how) queueMicrotask(onComplete);
            resolve(how);
        };
        const burst = (renderer)=>({
                cancel: ()=>end('cancelled'),
                finished,
                renderer: renderer?.kind
            });
        const respectReducedMotion = options.respectReducedMotion ?? true;
        const origin = resolveOrigin(options.origin);
        if (respectReducedMotion && prefersReducedMotion() || !origin) {
            end('skipped');
            return burst();
        }
        const lease = overlay.acquire(options.zIndex ?? DEFAULT_Z_INDEX, ()=>end(entry ? 'complete' : 'skipped'));
        if (!lease) {
            end('skipped');
            return burst();
        }
        release = lease.release;
        let config;
        let sources;
        try {
            config = resolveConfig(effect, options.config);
            sources = effect.sprites(config);
        } catch  {
            end('skipped');
            return burst(lease.renderer);
        }
        atlas.load(sources, pixelRatio()).then((regions)=>{
            if (ended) return;
            let simulation;
            try {
                simulation = createSimulation(effect, config, {
                    origin,
                    seed: options.seed
                });
            } catch  {
                end('skipped');
                return;
            }
            entry = {
                simulation,
                batch: {
                    pool: simulation.pool,
                    regions,
                    blend: effect.blend
                },
                renderer: lease.renderer,
                end
            };
            running.add(entry);
            stop ??= loop.add(frame);
        }, ()=>end('skipped'));
        return burst(lease.renderer);
    };
    return {
        fire
    };
};
let stage_preference = 'auto';
let stage_shared;
const getStage = ()=>{
    if (!stage_shared) {
        const atlas = createAtlas();
        const overlay = createOverlay({
            createRenderer: (createCanvas, onLost)=>select_createRenderer(stage_preference, createCanvas, onLost),
            onUnmount: ()=>atlas.clear()
        });
        stage_shared = {
            stage: createStage({
                loop: getLoop(),
                atlas,
                overlay
            }),
            overlay
        };
    }
    return stage_shared.stage;
};
const setRenderer = (next)=>{
    if (next === stage_preference) return;
    stage_preference = next;
    stage_shared?.overlay.reset();
};
const stage_fire = (effect, options)=>getStage().fire(effect, options);
const clamp = (value, min, max)=>Math.min(Math.max(value, min), max);
const lerp = (from, to, t)=>from + (to - from) * t;
const degToRad = (degrees)=>Math.PI / 180 * degrees;
const damp = (value, rate, dt)=>value * Math.exp(-rate * dt);
const accelerate = (velocity, acceleration, drag, dt)=>{
    if (0 === drag) return velocity + acceleration * dt;
    const terminal = acceleration / drag;
    return terminal + (velocity - terminal) * Math.exp(-drag * dt);
};
const linear = (t)=>t;
const easeInQuad = (t)=>t * t;
const easeOutQuad = (t)=>t * (2 - t);
const easeInOutQuad = (t)=>t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
const easeInCubic = (t)=>t * t * t;
const easeOutCubic = (t)=>1 - (1 - t) ** 3;
const easeInOutCubic = (t)=>t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
const balloonraw_namespaceObject = "<svg width=\"976\" height=\"3040\" viewBox=\"0 0 976 3040\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\">\n<path d=\"M489.693 1269.49C489.773 1378.79 410.493 1466.8 389.107 1571.11C384.147 1595.33 382.893 1620.12 386.187 1644.64C389.44 1668.83 399.28 1691.16 409.04 1713.29C419.253 1736.44 429.28 1760.11 429.453 1785.83C429.64 1812.27 416.307 1836.8 408.933 1861.59C396 1905.15 409.613 1948.88 425.213 1989.73C442.04 2033.83 461.387 2077.87 456.6 2126.17C453.92 2153.15 444.147 2179.13 434.2 2204.13C424.173 2229.35 413.72 2254.28 405.507 2280.17C389.213 2331.51 379.493 2385.83 378.267 2439.72C377.693 2464.89 380.333 2490.25 388.667 2514.11C397.053 2538.09 412.6 2558.75 424.733 2580.84C449.907 2626.64 458.453 2681 451.053 2732.52C443.853 2782.56 414.227 2825.99 408.893 2876.35C404.44 2918.39 416.733 2961.63 440.08 2996.53C450.373 3011.91 463.267 3025.44 477.867 3036.75C480.773 3039 484.88 3034.95 481.947 3032.68C446.147 3004.96 423.24 2964.2 415.907 2919.71C412.107 2896.61 413.627 2872.95 419.427 2850.35C426.053 2824.51 438.067 2800.36 446.667 2775.17C462.44 2729 463.147 2678.51 450.92 2631.45C444.733 2607.64 434.453 2585.4 421.893 2564.32C407.933 2540.91 394.307 2518.68 388.32 2491.71C382.493 2465.45 383.413 2438 385.56 2411.37C387.853 2382.85 392.467 2354.56 398.827 2326.67C405 2299.61 413.253 2273.05 423.107 2247.12C432.533 2222.27 443.533 2198.05 451.867 2172.8C459.707 2149.04 464.387 2124.29 463 2099.23C461.773 2077.19 455.64 2055.65 448.467 2034.89C433.587 1991.8 411.307 1949.77 409.413 1903.37C408.36 1877.76 417.12 1854.67 425.587 1830.97C433.68 1808.33 437.44 1786.41 432.787 1762.6C428.307 1739.63 417.333 1718.23 408.12 1696.91C397.267 1671.77 390.413 1646.41 390.013 1618.89C388.387 1509.52 469.707 1420.85 490.813 1316.72C493.973 1301.19 495.467 1285.33 495.453 1269.49C495.453 1265.77 489.693 1265.77 489.693 1269.49\" stroke=\"#7A7E82\" stroke-width=\"4\"/>\n<path d=\"M555.653 1298.41H423.52C415.173 1298.41 408.413 1305.17 408.413 1313.52C408.413 1321.85 415.173 1328.63 423.52 1328.63H555.653C564 1328.63 570.76 1321.85 570.76 1313.52C570.76 1305.17 564 1298.41 555.653 1298.41Z\" fill=\"currentColor\"/>\n<path d=\"M555.653 1298.41H423.52C415.173 1298.41 408.413 1305.17 408.413 1313.52C408.413 1321.85 415.173 1328.63 423.52 1328.63H555.653C564 1328.63 570.76 1321.85 570.76 1313.52C570.76 1305.17 564 1298.41 555.653 1298.41Z\" fill=\"black\" fill-opacity=\"0.1\"/>\n<path d=\"M975.133 528.947C975.133 820.667 756.973 1255.43 487.853 1255.43C218.733 1255.43 0.559814 820.667 0.559814 528.947C0.559814 237.227 218.733 0.733359 487.853 0.733359C756.973 0.733359 975.133 237.227 975.133 528.947Z\" fill=\"currentColor\"/>\n<path d=\"M549.04 1298.41C531.293 1285.91 519.893 1269.95 512.587 1254.2C504.387 1255.01 496.147 1255.43 487.853 1255.43C481.04 1255.43 474.28 1255.15 467.546 1254.6C460.226 1270.21 448.867 1286.01 431.253 1298.41H549.04Z\" fill=\"currentColor\"/>\n<path d=\"M211.413 569.213C193.787 569.213 175.947 564.4 160.92 555.24C128.133 535.293 108.133 498.56 101.147 460.827C97.0133 438.533 96.9468 415.827 99.1068 393.214C120.627 308.28 168.453 234.48 233.467 183.733C246.947 173.213 261.16 163.693 276.027 155.267C280.347 152.813 284.72 150.467 289.147 148.2C291.707 147.373 294.347 146.92 297.12 146.92C301.347 146.92 305.907 147.974 311.067 150.414C332.773 160.64 334.36 192.213 323.693 213.72C313.04 235.226 294.187 251.8 283.413 273.253C262 315.88 276.48 366.707 287.347 413.147C298.213 459.6 302.427 515.373 267.8 548.187C252.707 562.48 232.227 569.213 211.413 569.213\" fill=\"white\" fill-opacity=\"0.2\"/>\n<path d=\"M785.133 110.4C863.72 204.187 911.613 328.747 911.613 465.414C911.613 757.147 693.44 1191.89 424.32 1191.89C350.973 1191.89 281.413 1159.6 219.013 1106.71C296.067 1196.16 388.48 1255.43 487.853 1255.43C756.973 1255.43 975.133 820.667 975.133 528.947C975.133 358.547 900.693 206.987 785.133 110.4Z\" fill=\"black\" fill-opacity=\"0.1\"/>\n</svg>\n";
const ASPECT = 3040 / 976;
const SWAY = 1;
const TILT = 0.2;
const FADE = 0.2;
const balloon = /* @__PURE__ */ defineEffect({
    name: 'balloon',
    blend: 'normal',
    defaults: {
        count: 16,
        size: 30,
        colors: [
            '#A45BF1',
            '#25C6F6',
            '#72F753',
            '#F76C88',
            '#F5F770'
        ],
        angle: 90,
        spread: 90,
        velocity: 300,
        drag: 2,
        gravity: -300,
        lifetime: 5000
    },
    sprites: ({ size, colors })=>colors.map((color)=>({
                svg: balloonraw_namespaceObject.replaceAll('currentColor', color),
                width: size,
                height: size * ASPECT
            })),
    spawn: (p, config, rng)=>{
        const direction = degToRad(config.angle + rng.range(-0.5, 0.5) * config.spread);
        const speed = config.velocity * rng.range(0.5, 1.5);
        p.sprite = rng.int(0, config.colors.length);
        p.life *= rng.range(0.85, 1);
        p.scale = rng.range(0.9, 1.1);
        p.s0 = rng.range(0.8, 1.2);
        p.s1 = rng.range(0, 2 * Math.PI);
        p.s2 = rng.range(1, 2);
        const sway = config.size * SWAY * p.s2;
        p.vx = Math.cos(direction) * speed + sway * Math.cos(p.s1);
        p.vy = -Math.sin(direction) * speed;
        p.rotation = TILT * Math.cos(p.s1);
    },
    update: (p, dt, config)=>{
        const sway = config.size * SWAY * p.s2;
        const vx = p.vx - sway * Math.cos(p.s1);
        p.s1 += p.s2 * dt;
        p.vx = damp(vx, config.drag, dt) + sway * Math.cos(p.s1);
        p.vy = accelerate(p.vy, config.gravity * p.s0, config.drag, dt);
        p.rotation = TILT * Math.cos(p.s1);
        p.alpha = clamp((p.life - p.age) / (p.life * FADE), 0, 1);
    }
});
const effect_ASPECT = 0.625;
const effect_FADE = 0.2;
const SWING_MIN = 4;
const SWING_MAX = 8;
const SWAY_FLUTTER = 0.15;
const SWAY_TUMBLE = 0.06;
const ARC_FLUTTER = 0.15;
const ARC_TUMBLE = 0.06;
const ROCK = 0.2;
const SPIN = 0.5;
const TUMBLE = 3;
const FLIP = 1.4;
const GLIDE = 0.3;
const FALL_MIN = 0.8;
const FALL_MAX = 1.2;
const SETTLE_FROM = -0.4;
const SETTLE_TO = 1.6;
const settled = (vy, gravity, fall, drag)=>{
    if (0 === fall) return 0;
    const share = vy * Math.sign(gravity) / fall;
    const sinceTop = share < 1 ? -Math.log(1 - share) / drag : SETTLE_TO;
    return easeInOutCubic(clamp((sinceTop - SETTLE_FROM) / (SETTLE_TO - SETTLE_FROM), 0, 1));
};
const motion = (s1, s3, config)=>{
    const speed = Math.abs(s1);
    const tumbler = (speed - SWING_MIN) / (SWING_MAX - SWING_MIN);
    const gravity = config.gravity * s3;
    const fall = config.drag > 0 ? Math.abs(gravity) / config.drag : 0;
    return {
        speed,
        tumbler,
        gravity,
        fall,
        sway: fall * lerp(SWAY_FLUTTER, SWAY_TUMBLE, tumbler),
        arc: fall * lerp(ARC_FLUTTER, ARC_TUMBLE, tumbler)
    };
};
const confetti = /* @__PURE__ */ defineEffect({
    name: 'confetti',
    blend: 'normal',
    defaults: {
        count: 100,
        size: 10,
        colors: [
            '#A45BF1',
            '#25C6F6',
            '#72F753',
            '#F76C88',
            '#F5F770'
        ],
        angle: 90,
        spread: 60,
        velocity: 1500,
        drag: 3,
        gravity: 900,
        lifetime: 3000
    },
    sprites: ({ size, colors })=>colors.map((color)=>({
                shape: 'rect',
                color,
                width: size,
                height: size * effect_ASPECT
            })),
    spawn: (p, config, rng)=>{
        const direction = degToRad(config.angle + rng.range(-0.5, 0.5) * config.spread);
        const speed = config.velocity * rng.range(0.5, 1.5);
        p.rotation = rng.range(0, 2 * Math.PI);
        p.sprite = rng.int(0, config.colors.length);
        p.life *= rng.range(0.85, 1);
        p.s0 = rng.range(0, 2 * Math.PI);
        p.s1 = rng.range(SWING_MIN, SWING_MAX) * (rng.next() < 0.5 ? -1 : 1);
        p.s3 = rng.range(FALL_MIN, FALL_MAX);
        const { gravity, fall, sway, arc } = motion(p.s1, p.s3, config);
        const vy = -Math.sin(direction) * speed;
        p.s2 = settled(vy, gravity, fall, config.drag);
        p.vx = Math.cos(direction) * speed + p.s2 * sway * Math.cos(p.s0);
        p.vy = vy - p.s2 * arc * Math.sin(2 * p.s0);
        p.scaleY = Math.cos(FLIP * p.s0);
    },
    update: (p, dt, config)=>{
        const side = Math.sign(p.s1);
        const { speed, tumbler, gravity, fall, sway, arc } = motion(p.s1, p.s3, config);
        const before = p.s2;
        const phase = p.s0;
        const vx = p.vx - before * sway * Math.cos(phase);
        const vy = p.vy + before * arc * Math.sin(2 * phase);
        p.s0 = phase + speed * dt;
        const fallen = accelerate(vy, gravity, config.drag, dt);
        const midway = settled((vy + fallen) / 2, gravity, fall, config.drag);
        const after = settled(fallen, gravity, fall, config.drag);
        const glide = side * tumbler * GLIDE * Math.abs(gravity) * midway;
        p.vx = accelerate(vx, glide, config.drag, dt) + after * sway * Math.cos(p.s0);
        p.vy = fallen - after * arc * Math.sin(2 * p.s0);
        p.s2 = after;
        const spin = p.s1 * SPIN * (1 - midway) + side * tumbler * TUMBLE * midway;
        const rock = -ROCK * (1 - tumbler);
        p.rotation += spin * dt + rock * (after * Math.sin(p.s0) - before * Math.sin(phase));
        p.scaleY = Math.cos(FLIP * p.s0);
        p.alpha = clamp((p.life - p.age) / (p.life * effect_FADE), 0, 1);
    }
});
const POP = 0.15;
const emoji_effect_FADE = 0.2;
const effect_TILT = degToRad(15);
const emoji = /* @__PURE__ */ defineEffect({
    name: 'emoji',
    blend: 'normal',
    defaults: {
        count: 20,
        size: 25,
        emojis: [
            '🦄',
            '⚡️',
            '🥰'
        ],
        angle: 90,
        spread: 45,
        velocity: 1500,
        drag: 3,
        gravity: 900,
        lifetime: 3000,
        rotate: true
    },
    sprites: ({ size, emojis })=>emojis.map((glyph)=>({
                emoji: glyph,
                size
            })),
    spawn: (p, config, rng, index)=>{
        const direction = degToRad(config.angle + rng.range(-0.5, 0.5) * config.spread);
        const speed = config.velocity * rng.range(0.5, 1.5);
        p.vx = Math.cos(direction) * speed;
        p.vy = -Math.sin(direction) * speed;
        p.sprite = index % config.emojis.length;
        p.life *= rng.range(0.85, 1);
        p.s0 = rng.range(0.9, 1.1);
        p.scale = 0;
        const tilt = rng.range(-effect_TILT, effect_TILT);
        const spin = rng.range(0.5, 2) * (rng.next() < 0.5 ? -1 : 1);
        if (config.rotate) {
            p.rotation = tilt;
            p.s1 = spin;
        }
    },
    update: (p, dt, config)=>{
        p.vx = damp(p.vx, config.drag, dt);
        p.vy = accelerate(p.vy, config.gravity, config.drag, dt);
        p.rotation += p.s1 * dt;
        p.scale = p.s0 * easeOutCubic(clamp(p.age / POP, 0, 1));
        p.alpha = clamp((p.life - p.age) / (p.life * emoji_effect_FADE), 0, 1);
    }
});
const finite = (value)=>Number.isFinite(value);
const startOf = (arg, target)=>{
    if ('object' != typeof arg || null === arg) return target;
    if ('clientX' in arg) {
        const keyboard = 'click' === arg.type && 0 === arg.detail;
        return !keyboard && finite(arg.clientX) && finite(arg.clientY) ? {
            x: arg.clientX,
            y: arg.clientY
        } : target;
    }
    if ('getBoundingClientRect' in arg || 'current' in arg) return arg;
    return finite(arg.x) && finite(arg.y) ? arg : target;
};

export { balloon, confetti, emoji, stage_fire as fire };
