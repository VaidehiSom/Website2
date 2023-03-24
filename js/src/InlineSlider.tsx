import { Fragment, h } from "preact";
import { useState } from "preact/hooks";
import { SliderProps, useWindowWidth } from "./Slider";
import MultiImageSlider from "./MultiImageSlider";
import { SliderModal } from "./SliderModal";
import SingleImageSlider from "./SingleImageSlider";

export interface InlineSliderProps {
    images: SliderProps["images"];
    scrollbar: boolean;
    size: number;
    gutter: number;
}

const InlineSlider = ({
    images,
    scrollbar = false,
    size = 160,
    gutter = 16,
}: InlineSliderProps) => {
    const [openModal, setOpenModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const width = useWindowWidth();

    const onThumbnailClick = (index: number) => {
        setCurrentIndex(index);
        setOpenModal(true);
    };

    const breakpoint = 768;

    return (
        <div className={"position-relative m-4"}>
            {width >= breakpoint && (
                <Fragment>
                    <MultiImageSlider
                        size={size}
                        gutter={gutter}
                        scrollbar={scrollbar}
                        images={images}
                        onClick={onThumbnailClick}
                    />
                    {openModal && (
                        <SliderModal
                            onClose={() => setOpenModal(false)}
                            currentIndex={currentIndex}
                            images={images}
                        />
                    )}
                </Fragment>
            )}

            {width < breakpoint && (
                <Fragment>
                    <SingleImageSlider
                        images={images}
                        imageSize={800}
                        currentIndex={currentIndex}
                    />
                </Fragment>
            )}
        </div>
    );
};

export default InlineSlider;
