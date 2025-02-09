import * as React from 'react';
import "beercss";
import UrlCard from './component/url-card';
import axios from "axios";

export default function App() {
  // Step 1: Create State Variables
  const [longUrl, setLongUrl] = React.useState("")
  const [allUrls, setAllUrls] = React.useState([])
  
  // Step 2: Complete handleFormSubmit function
  const handleFormSubmit = (e) => {
    e.preventDefault()
    if(longUrl === "" || longUrl.trim() === ""){
      window.alert("Long URL is required")
    }
    else{
      var reqBody = {
        longUrl: longUrl,
      }
      axios.post(
        'http://localhost:4000/shorten-url', reqBody
      )
      .then((resp) => {
        setAllUrls([...allUrls, resp.data])
      })
      .catch((err) => {
        console.log(err)
      })
    }
  };

  // Step 3: Complete return statement
  return (
    <>
      <article
        className="medium middle-align center-align"
        style={{ width: "100%" }}
      >
        <div>
          <i className="extra">language</i>
          <h5>Custom URL shortner</h5>
          <div className="space"></div>
          <nav className="no-space">
            <div className="max field border left-round">
              <input
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="Enter Long URL"
                onKeyDown={(e) => {
                  if(e.key === "Enter"){
                    handleFormSubmit(e)
                  }
                }}
              />
            </div>
            <button
              className="large right-round"
              onClick={(e) => {handleFormSubmit(e)}}
            >
              Submit
            </button>
          </nav>
        </div>
      </article>
      {/* Step 4: Display all URLS */}
      {
        allUrls.map((url) => (
          <UrlCard urlObj={url}/>
        ))
      }
    </>
  );
}