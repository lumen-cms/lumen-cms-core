declare type InvertedIndicatorProps = {
    className?: string;
    active: boolean;
    color?: 'dark' | 'light';
    onClick: any;
};
declare function InvertedIndicator({ className, active, color, ...props }: InvertedIndicatorProps): JSX.Element;
export default InvertedIndicator;
