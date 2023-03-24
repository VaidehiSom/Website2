import StickySidebar from "sticky-sidebar";

export function startStickySidebar() {
    const headings = document.querySelectorAll(
        "#descriptionContent > h1, #descriptionContent > h2, #descriptionContent > h3, #descriptionContent > h4, #descriptionContent > h5, #descriptionContent > h6"
    );
    let stickySidebar = null;
    let activeStickyItem;
    const mobileNavigationBtn = document.querySelector("#mobileNavigationBtn");
    const alternativesHeading = document.querySelector("#alternativesHeading");
    const alternativesAnchor = document.querySelector("#alternatives");

    function initStickySidebar() {
        const stickyContent = document.querySelector("#stickySidebarContent");
        const mobileSectionNavigator = document.querySelector("#mobileSectionNavigator");
        const stickySidebarEl = document.querySelector("#stickySidebar");
        let firstStickyItem = null;
        let lastStickyItem = null;
        let clickTimeout = null;
        let allowAutoselect = false;

        // delay autoselect on DOMContentLoaded
        setTimeout(function () {
            allowAutoselect = true;
        }, 500);

        const setActiveSticky = (stickyItem, stickyNavItem) => {
            if (activeStickyItem) {
                activeStickyItem.classList.remove("sticky-sidebar__item--active");
            }

            stickyItem.classList.add("sticky-sidebar__item--active");
            stickyNavItem.setAttribute("selected", true);
            activeStickyItem = stickyItem;
        };

        const scrollToAnchor = (target) => {
            const index = parseInt(target.getAttribute("data-index"), 10);
            const CSSHeadingAnchorOffset = 100;
            const CSSHeadingAlternativeOffset = 300;

            if (index !== 1000) {
                const headingAnchor = headings[index];
                const elementTop = headingAnchor.getBoundingClientRect().top + window.scrollY;

                window.scroll({
                    top: elementTop - CSSHeadingAnchorOffset,
                    left: 0,
                    behavior: "smooth",
                });
                changeHashWithoutScrolling("#" + headingAnchor.getAttribute("id"));
                return;
            }

            const elementTop = alternativesAnchor.getBoundingClientRect().top + window.scrollY;
            // alternatives anchor
            window.scroll({
                top: elementTop - CSSHeadingAlternativeOffset,
                left: 0,
                behavior: "smooth",
            });
            changeHashWithoutScrolling("#" + alternativesAnchor.getAttribute("id"));
        };

        if (headings.length < 2) {
            // this actually hides it (d-none class will remain)
            mobileSectionNavigator.classList.remove("d-block");
            return;
        }

        stickySidebarEl.classList.add("d-lg-block");
        mobileSectionNavigator.classList.remove("d-none");

        headings.forEach(function (item, i) {
            let stickyItem = document.createElement("li");
            let link = document.createElement("a");
            let stickyNavItem = document.createElement("span");
            const text = item.textContent;
            const isLast = i === headings.length - 1;
            const anchorID = "#" + item.id;

            stickyItem.classList.add("py-1");
            stickyItem.classList.add("sticky-sidebar__item");
            stickyItem.setAttribute("data-index", i.toString());
            stickyNavItem.classList.add("dropdown-item");
            stickyNavItem.setAttribute("data-index", i.toString());

            if (i === 0) {
                firstStickyItem = stickyItem;
            }

            // set default active sticky item
            if (i === 0 || anchorID === window.location.hash) {
                setActiveSticky(stickyItem, stickyNavItem);
            }

            link.setAttribute("href", anchorID);
            link.innerText = text;

            stickyItem.appendChild(link);
            stickyNavItem.innerText = text;

            stickyContent.appendChild(stickyItem);
            document
                .querySelectorAll("#mobileSectionNavigator > .dropdown-menu")
                .forEach((el) => el.appendChild(stickyNavItem));

            if (!alternativesHeading && isLast) {
                lastStickyItem = stickyItem;
            }

            if (alternativesHeading && isLast) {
                stickyItem = document.createElement("li");
                stickyNavItem = stickyNavItem.cloneNode() as HTMLSpanElement;
                link = document.createElement("a");

                stickyItem.classList.add("py-1");
                stickyItem.classList.add("sticky-sidebar__item");
                stickyItem.setAttribute("data-index", "1000");
                stickyNavItem.setAttribute("data-index", "1000");

                link.setAttribute("href", "#" + alternativesAnchor.id);
                link.innerText = alternativesHeading.textContent;

                stickyItem.appendChild(link);
                stickyNavItem.innerText = alternativesHeading.textContent;
                lastStickyItem = stickyItem;
                stickyContent.appendChild(stickyItem);
                document
                    .querySelectorAll("#mobileSectionNavigator > .dropdown-menu")
                    .forEach((el) => el.appendChild(stickyNavItem));

                if (window.location.hash === "#alternatives") {
                    setActiveSticky(stickyItem, stickyNavItem);
                }
            }
        });

        document.querySelectorAll("#mobileSectionNavigator > .dropdown-menu").forEach((el) => {
            el.addEventListener("click", function () {
                mobileNavigationBtn.textContent = el.textContent;
                scrollToAnchor(el);
            });
        });

        document.querySelectorAll(".sticky-sidebar__item").forEach((el) => {
            el.addEventListener("click", function (e) {
                mobileNavigationBtn.textContent = el.textContent;
                const target = el;

                e.preventDefault();

                allowAutoselect = false;

                scrollToAnchor(target);

                if (clickTimeout) {
                    clearTimeout(clickTimeout);
                }

                clickTimeout = setTimeout(function () {
                    allowAutoselect = true;
                }, 1000);
            });
        });

        stickySidebar = new StickySidebar("#stickySidebar", {
            topSpacing: 350,
            containerSelector: "#stickyContainer",
            innerWrapperSelector: ".sticky-sidebar__inner",
        });

        stickySidebarEl.addEventListener("affix.static.stickySidebar", function () {
            if (!allowAutoselect) {
                return;
            }

            activeStickyItem.classList.remove("sticky-sidebar__item--active");
            firstStickyItem.classList.add("sticky-sidebar__item--active");
            activeStickyItem = firstStickyItem;
        });

        stickySidebarEl.addEventListener("affix.container-bottom.stickySidebar", function (event) {
            if (!allowAutoselect) {
                return;
            }

            activeStickyItem.classList.remove("sticky-sidebar__item--active");
            lastStickyItem.classList.add("sticky-sidebar__item--active");
            activeStickyItem = lastStickyItem;
        });
    }

    function handleStickyScrolling() {
        document.querySelectorAll(".sticky-sidebar__item").forEach((el) => {
            const index = parseInt(el.getAttribute("data-index"), 10);

            const headingAnchor = index !== 1000 ? headings[index] : alternativesAnchor;
            const scrollPos = window.pageYOffset;
            const elementTop = headingAnchor?.getBoundingClientRect()?.top + window.scrollY;
            const paddingAdjustment = index !== 1000 ? 100 : 300;
            const adjustedTop = Math.floor(elementTop) - paddingAdjustment;

            if (scrollPos >= adjustedTop) {
                el.classList.add("sticky-sidebar__item--active");

                if (activeStickyItem !== el) {
                    activeStickyItem.classList.remove("sticky-sidebar__item--active");
                    activeStickyItem = el;
                }
            }
        });
    }

    // called from img attribute - check below
    function onLogoLoaded() {
        if (stickySidebar) {
            stickySidebar.updateSticky();
        }
    }

    function addLogoImage() {
        const paragraphs = document.querySelector("#descriptionContent").querySelectorAll("p");
        const hasParagraph = paragraphs.length;
        const hasHeadings = headings.length;

        if (!(window as any).vizzloExamples.length || (!hasHeadings && !hasParagraph)) {
            return;
        }

        const image = document.createElement("img");
        image.setAttribute("src", (window as any).vizzloLogoImage);
        image.setAttribute("loading", "lazy");
        image.setAttribute("alt", "{{ page.title ~ 'description example'}}");
        image.addEventListener("load", onLogoLoaded);
        image.classList.add("market-details__logo-image img-fluid");

        const imageWrap = document.createElement("div");
        imageWrap.classList.add("market-details__logo-wrap text-center mb-4");
        imageWrap.appendChild(image);

        if (hasHeadings) {
            document.insertBefore(headings[1].previousElementSibling, imageWrap);
            return;
        }

        if (hasParagraph) {
            document.insertBefore(paragraphs[0], imageWrap);
        }
    }

    function changeHashWithoutScrolling(hash) {
        const id = hash.replace(/^.*#/, "");
        const el = document.getElementById(id);

        el.id = id + "-tmp";
        window.location.hash = hash;
        el.id = id;
    }

    document.querySelector("#topScrollButton")?.addEventListener("click", function (e) {
        e.preventDefault();

        window.scroll({
            top: document.querySelector("#top").getBoundingClientRect().top,
            left: 0,
            behavior: "smooth",
        });
        changeHashWithoutScrolling("#top");
    });

    document.addEventListener("DOMContentLoaded", function () {
        initStickySidebar();

        if (document.body.scrollTop > 0) {
            addLogoImage();
        } else {
            document.addEventListener("scroll", function () {
                addLogoImage();
            });
        }
    });

    document.addEventListener("scroll", () => {
        handleStickyScrolling();
    });
}
