/* News app — a clean macOS-style "Updates & announcements" feed.
   Reads window.SITE.news (array, newest first). No props. Registers window.NewsApp.
   Loaded as a classic <script> in global scope, so EVERYTHING is wrapped in an IIFE. */
(function () {
  "use strict";

  const { useMemo } = React;

  function NewsMedia({ media }) {
    if (!media || !media.src) return null;
    if (media.type === "video") {
      return (
        <div className="news-media">
          <video className="news-media-el" src={media.src}
                 autoPlay loop muted playsInline />
        </div>
      );
    }
    return (
      <div className="news-media">
        <img className="news-media-el" src={media.src} alt="" loading="lazy" />
      </div>
    );
  }

  function NewsItem({ item }) {
    const paras = String(item.body || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    return (
      <article className="news-item">
        <div className="news-meta">
          {item.date && <span className="news-date">{item.date}</span>}
          {item.tag && <span className="news-tag">{item.tag}</span>}
        </div>
        {item.title && <h2 className="news-title">{item.title}</h2>}
        {paras.map((p, i) => <p className="news-body" key={i}>{p}</p>)}
        <NewsMedia media={item.media} />
        {item.href && (
          <a className="news-link" href={item.href} target="_blank" rel="noopener">
            Read more ↗
          </a>
        )}
      </article>
    );
  }

  function News() {
    const items = useMemo(() => {
      const n = (window.SITE && window.SITE.news) || [];
      return Array.isArray(n) ? n : [];
    }, []);

    return (
      <div className="win-body app-news">
        <style>{`
          .app-news {
            flex: 1;
            overflow-y: auto;
            background: #fcfcfc;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
            color: #1d1d1f;
            -webkit-font-smoothing: antialiased;
          }
          .news-wrap {
            max-width: 620px;
            margin: 0 auto;
            padding: 34px 26px 60px;
          }
          .news-header { margin: 0 0 8px; }
          .news-h-title {
            margin: 0;
            font-size: 30px;
            font-weight: 700;
            letter-spacing: -0.02em;
          }
          .news-h-sub {
            margin: 4px 0 0;
            font-size: 14px;
            color: #86868b;
          }
          .news-item {
            padding: 26px 0 28px;
            border-top: 1px solid rgba(0, 0, 0, 0.08);
          }
          .news-item:first-of-type { border-top: none; padding-top: 18px; }
          .news-meta {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 7px;
          }
          .news-date {
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 11.5px;
            letter-spacing: 0.02em;
            text-transform: uppercase;
            color: #98989d;
          }
          .news-tag {
            font-size: 11px;
            font-weight: 600;
            line-height: 1;
            padding: 4px 9px;
            border-radius: 999px;
            color: var(--accent);
            background: var(--accent-soft);
            letter-spacing: 0.01em;
          }
          .news-title {
            margin: 0 0 8px;
            font-size: 19px;
            font-weight: 700;
            line-height: 1.3;
            letter-spacing: -0.01em;
          }
          .news-body {
            margin: 0 0 10px;
            font-size: 15px;
            line-height: 1.62;
            color: #3a3a3c;
          }
          .news-media {
            margin: 14px 0 6px;
            border-radius: 12px;
            overflow: hidden;
            background: #f0f0f2;
            border: 1px solid rgba(0, 0, 0, 0.06);
          }
          .news-media-el {
            display: block;
            width: 100%;
            max-height: 260px;
            object-fit: cover;
          }
          .news-link {
            display: inline-block;
            margin-top: 6px;
            font-size: 14px;
            font-weight: 500;
            color: var(--accent);
            text-decoration: none;
          }
          .news-link:hover { text-decoration: underline; }
          .news-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            min-height: 60vh;
            text-align: center;
            color: #86868b;
          }
          .news-empty-icon { font-size: 44px; line-height: 1; }
          .news-empty-text { font-size: 15px; }
        `}</style>

        <div className="news-wrap">
          <header className="news-header">
            <h1 className="news-h-title">News</h1>
            <p className="news-h-sub">Updates &amp; announcements</p>
          </header>

          {items.length === 0 ? (
            <div className="news-empty">
              <div className="news-empty-icon">📰</div>
              <div className="news-empty-text">No news yet — check back soon.</div>
            </div>
          ) : (
            items.map((item, i) => <NewsItem item={item} key={i} />)
          )}
        </div>
      </div>
    );
  }

  window.NewsApp = News;
})();
