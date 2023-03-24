import { SliderProps } from "./Slider";
import { Fragment, h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

interface Props {
    imageSize: 400 | 800 | 1600;
    images: SliderProps["images"];
    videoId?: string;
    currentIndex: number;
    vizzard?: SliderProps["vizzard"];
}

const SingleImageSlider = ({ images, videoId, imageSize, currentIndex, vizzard }: Props) => {
    const [current, setCurrent] = useState(currentIndex);
    const [width, setWidth] = useState(0);
    const [showingVideo, setShowingVideo] = useState(false);
    const scrollRef = useRef<HTMLDivElement>();

    const prev = () => {
        setCurrent((p) => (p <= 0 ? images.length - 1 : p - 1));
    };

    const next = () => {
        setCurrent((p) => (p >= images.length - 1 ? 0 : p + 1));
    };

    useEffect(() => {
        scrollRef.current?.scrollTo({
            behavior: "smooth",
            left: width * current,
        });
    }, [current, width, scrollRef]);

    const isVideo = (i) => i === 1 && !!videoId;

    useEffect(() => {
        const listener = () => {
            setWidth(scrollRef.current?.clientWidth);
        };
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    }, []);

    useEffect(() => {
        setWidth(scrollRef.current.clientWidth);
    }, [scrollRef.current]);

    useEffect(() => {
        let h: NodeJS.Timeout;
        if (isVideo(current)) {
            setShowingVideo(true);
        } else if (showingVideo) {
            h = setTimeout(() => setShowingVideo(false), 1000);
        }

        () => {
            clearTimeout(h);
        };
    }, [current]);

    const imagesToRender = images.length > 0 ? images : !!vizzard?.image ? [vizzard.image] : [];

    return (
        <div className={"position-relative"}>
            <div ref={scrollRef} className={"d-flex flex-row overflow-hidden"}>
                {imagesToRender.map((image, i) => (
                    <div key={i} className={"col-12 m-0 p-0"}>
                        {isVideo(i) ? (
                            showingVideo && (
                                <iframe
                                    width={scrollRef.current?.clientWidth}
                                    height={scrollRef.current?.clientWidth * 0.5695}
                                    src={"https://www.youtube.com/embed/" + videoId}
                                    frameBorder={0}
                                    allowFullScreen={true}
                                    title="video"
                                />
                            )
                        ) : (
                            <img
                                loading={"lazy"}
                                src={image.src.replace("[SIZE]", imageSize + "x")}
                                alt={image.alt}
                                className={"w-100"}
                            />
                        )}
                    </div>
                ))}
            </div>

            {imagesToRender.length > 1 && (
                <Fragment>
                    <div className={"slider-arrow prev big"} onClick={prev}>
                        <svg viewBox={"0 0 24 24"} width={48} height={48}>
                            <path
                                fill="currentColor"
                                d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                            />
                        </svg>
                    </div>

                    <div className={"slider-arrow next big"} onClick={next}>
                        <svg viewBox={"0 0 24 24"} width={48} height={48}>
                            <path
                                fill="currentColor"
                                d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                            />
                        </svg>
                    </div>
                </Fragment>
            )}
        </div>
    );
};

export default SingleImageSlider;
