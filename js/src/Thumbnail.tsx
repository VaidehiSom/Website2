import { h } from "preact";
import { SliderImage } from "./Slider";

interface Props {
    image: SliderImage;
    onClick: () => void;
    size: number;
    gutter: number;
}

const Thumbnail = ({ image, onClick, size = 160, gutter = 16 }: Props) => {
    return (
        <img
            onClick={onClick}
            src={image.src.replace("[SIZE]", "400x")}
            alt={image.alt}
            loading={"lazy"}
            style={{ width: size + "px", marginRight: gutter + "px" }}
            className={"thumbnail"}
        />
    );
};

export default Thumbnail;
