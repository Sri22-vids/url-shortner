import "beercss";

export default function UrlCard({urlObj}) {
    console.log(urlObj)
  return (
    <>
      <nav class="row padding surface-container" key={urlObj.id}>
        <div class="max">
          <h6 class="small">{urlObj.shortUrl}</h6>
          <div>{urlObj.originalUrl}</div>
        </div>
        <button
          class="transparent circle"
          onClick={() => {
            navigator.clipboard
              .writeText(urlObj.shortUrl)
              .then(() => {
                window.alert("Copied");
              })
              .catch((e) => {
                console.log(e);
                window.alert("Error Copying urlObj");
              });
          }}
        >
          <i>content_copy</i>
        </button>
        <a href={urlObj.shortUrl} target="_blank" rel="noreferrer">
          <i>open_in_new</i>
        </a>
      </nav>
    </>
  );
}
