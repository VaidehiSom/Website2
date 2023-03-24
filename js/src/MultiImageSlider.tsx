import { Fragment, h } from "preact";
import { SliderProps } from "./Slider";
import Thumbnail from "./Thumbnail";
import { useRef } from "preact/hooks";

interface Props {
    images: SliderProps["images"];
    onClick: (index: number) => void;
    scrollbar: boolean;
    size: number;
    gutter: number;
}

const MultiImageSlider = ({
    images,
    onClick,
    size = 160,
    gutter = 16,
    scrollbar = false,
}: Props) => {
    const scrollRef = useRef<HTMLDivElement>();

    const prev = () => {
        scrollRef.current.scrollBy({
            behavior: "smooth",
            left: -(size + gutter),
        });
    };

    const next = () => {
        scrollRef.current.scrollBy({
            behavior: "smooth",
            left: size + gutter,
        });
    };
    const overflowClass = !!scrollbar ? "overflow-auto" : "overflow-hidden";

    return (
        <Fragment>
            <div ref={scrollRef} className={`d-flex flex-row mt-3 ${overflowClass} slider`}>
                {images.map((image, i) => (
                    <div key={i}>
                        <Thumbnail
                            size={size}
                            gutter={gutter}
                            image={image}
                            onClick={() => onClick(i)}
                        />
                    </div>
                ))}
            </div>

            <div className={"slider-arrow prev"} onClick={prev}>
                <svg viewBox={"0 0 24 24"} width={24} height={24}>
                    <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
            </div>

            <div className={"slider-arrow next"} onClick={next}>
                <svg viewBox={"0 0 24 24"} width={24} height={24}>
                    <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
            </div>
        </Fragment>
    );
};

export default MultiImageSlider;
