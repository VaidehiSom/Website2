import { startPortfolioSearchApp } from "./portfolio-search";
import { h, render } from "preact";
import { Slider, SliderProps } from "./Slider";
import InlineSlider, { InlineSliderProps } from "./InlineSlider";
import smoothscroll from "smoothscroll-polyfill";
import { startStickySidebar } from "./sticky-sidebar";

window["startPortfolioSearchApp"] = startPortfolioSearchApp;

window["enableSmoothScroll"] = () => {
    window["__forceSmoothScrollPolyfill__"] = true;
    smoothscroll.polyfill();
};

window["startSliderApp"] = (props: SliderProps, target): void => {
    render(<Slider {...props} />, target);
};

window["startInlineSliderApp"] = (props: InlineSliderProps, target): void => {
    render(<InlineSlider {...props} />, target);
};

window["startStickySidebar"] = startStickySidebar;

if (window.CustomEvent) {
    document.body.dispatchEvent(new CustomEvent("site-app-init"));
}
