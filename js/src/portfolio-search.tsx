import { Fragment, h, render } from "preact";

function Card(props: { slug: string; title: string; desc: string }): JSX.Element {
    return (
        <div className="col-md-4 col-6 col-lg-3">
            <a href={`/create/${props.slug}`} className="card card--market d-block">
                <img
                    className="card-img-top mb-3 img-fluid lazy"
                    style="aspect-ratio: 4/3"
                    alt={props.title}
                    src={`/site/img/vizzards/${props.slug}-400x.png`}
                    srcset={`/site/img/vizzards/${props.slug}-400x.png 1x, /site/img/vizzards/${props.slug}.png 2x`}
                />
                <div className="card-body p-0">
                    <h4 className="card-title">{props.title}</h4>
                    <p className="card-text">{props.desc}</p>
                </div>
            </a>
            <div class="card-bottom-border"></div>
        </div>
    );
}

export function startPortfolioSearchApp() {
    const inputField = document.querySelector<HTMLInputElement>("#portfolio_search_query_input");
    inputField.focus();

    const q = new URLSearchParams(window.location.search)?.get("q");
    if (q) {
        inputField.value = q;

        fetch(`/siteapi/portfolio-search?q=${encodeURIComponent(q)}`)
            .then((x) => x.json())
            .then((list) => {
                document.querySelector(".market-nav-tabs-wrapper")?.remove();
                const results = document.querySelector("#portfolio_search_results");
                results.innerHTML = "";
                render(
                    <Fragment>
                        <div className="market-nav-tabs-wrapper">
                            <div className="nav nav-tabs--market">
                                <a href="/graphs" className="nav-link">
                                    <i class="svg-icon svg-icon--20">
                                        <svg>
                                            <use xlinkHref="/site/img/icons.svg#chevron-left"></use>
                                        </svg>
                                    </i>
                                    Back
                                </a>
                                <span className="nav-link active">
                                    {list.length} result{list.length != 1 ? "s" : ""} for “{q}”
                                </span>
                            </div>
                        </div>
                        <section className="cards">
                            <div className="row row-md-top">{list.map((props) => Card(props))}</div>
                        </section>
                    </Fragment>,
                    results
                );
            });
    }
}
