import { h, Fragment } from "preact";
import SingleImageSlider from "./SingleImageSlider";
import { SliderProps } from "./Slider";

interface Props {
    images: SliderProps["images"];
    vizzard?: SliderProps["vizzard"];
    videoId?: string;
    currentIndex: number;
    onClose: () => void;
}

const SliderModal = ({ onClose, ...props }: Props) => {
    return (
        <Fragment>
            <div className={"modal fade show p-0 d-md-block d-none"}>
                <div className={"position-absolute backdrop w-100 h-100"} onClick={onClose} />
                <div className={"modal-dialog market-details-modal modal-dialog-centered modal-lg"}>
                    <div className={"modal-content"}>
                        <div className={"modal-body p-0"}>
                            <SingleImageSlider imageSize={1600} {...props} />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export { SliderModal };
