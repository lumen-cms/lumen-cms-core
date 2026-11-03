export const carouselFixtures = {
 loop: { component: 'slider', _uid: 'loop' },
 bounded: { component: 'swiper', _uid: 'bounded' },
 single: { component: 'slider', _uid: 'single' },
 autoplay: { component: 'slider', _uid: 'auto', autoslide: '1000', pause_on_hover: true },
}
export const carouselSlides = ['First', 'Second', 'Third'].map((text, i) => ({ component: 'html', _uid: `slide-${i}`, body: `<div data-parity-slide="${i}" style="height:240px;background:${['#eef','#efe','#fee'][i]}">${text}</div>` }))
