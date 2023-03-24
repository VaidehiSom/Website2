import { Fragment, h } from "preact";
import MultiImageSlider from "./MultiImageSlider";
import SingleImageSlider from "./SingleImageSlider";
import { useEffect, useState } from "preact/hooks";
import { SliderModal } from "./SliderModal";

export interface SliderImage {
    src: string;
    alt: string;
}

export interface SliderProps {
    vizzard: { title: string; desc: string; image: SliderImage };
    images: SliderImage[];
    screenshot?: SliderImage;
    videoId: string;
    scrollbar: boolean;
}

export const useWindowWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const listener = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    }, []);

    return width;
};

const Slider = (props: SliderProps) => {
    const [openModal, setOpenModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { screenshot, images } = props;
    const width = useWindowWidth();

    const allImages = [...images];

    if (!!screenshot) allImages.splice(0, 0, screenshot);

    if (!!props.videoId) {
        allImages.splice(1, 0, {
            src: `https://img.youtube.com/vi/${props.videoId}/maxresdefault.jpg`,
            alt: "Video Thumbnail",
        });
    }

    const thumbnails = [...allImages];

    const firstImage = thumbnails.splice(0, 1)[0];

    const onThumbnailClick = (index: number) => {
        setCurrentIndex(index + 1);
        setOpenModal(true);
    };

    const onPreviewClick = () => {
        setCurrentIndex(0);
        setOpenModal(true);
    };

    return (
        <Fragment>
            {width >= 992 && (
                <Fragment>
                    {!!firstImage ? (
                        <div className={"w-100 d-none d-lg-block"}>
                            <div className={"position-relative"}>
                                <img
                                    loading={"lazy"}
                                    src={firstImage.src.replace("[SIZE]", "800x")}
                                    alt={firstImage.alt}
                                    className={"w-100"}
                                />
                                <div
                                    onClick={onPreviewClick}
                                    className={
                                        "preview-cover position-absolute d-flex align-items-center justify-content-center"
                                    }
                                >
                                    <svg viewBox={"0 0 24 24"} width={100} height={100}>
                                        <path
                                            fill={"white"}
                                            d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                                        ></path>
                                    </svg>
                                </div>
                            </div>

                            <div className={"position-relative"}>
                                <MultiImageSlider
                                    images={thumbnails}
                                    onClick={onThumbnailClick}
                                    scrollbar={false}
                                    gutter={16}
                                    size={160}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className={"w-100 d-none d-lg-block"}>
                            <img
                                loading={"lazy"}
                                src={props.vizzard.image.src}
                                alt={`Create ${props.vizzard.title}`}
                                className={"w-100"}
                            />
                        </div>
                    )}

                    {openModal && (
                        <SliderModal
                            onClose={() => setOpenModal(false)}
                            currentIndex={currentIndex}
                            images={allImages}
                            videoId={props.videoId}
                            vizzard={props.vizzard}
                        />
                    )}
                </Fragment>
            )}

            {width < 992 && (
                <div className={"w-100 flex-column "}>
                    <div className={"col-12 col-lg-8 m-0 p-0"}>
                        {width > 567 && (
                            <SingleImageSlider
                                videoId={props.videoId}
                                images={allImages}
                                imageSize={800}
                                currentIndex={0}
                                vizzard={props.vizzard}
                            />
                        )}
                        {width < 567 && (
                            <SingleImageSlider
                                videoId={props.videoId}
                                images={allImages}
                                imageSize={400}
                                currentIndex={0}
                                vizzard={props.vizzard}
                            />
                        )}
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export { Slider };
