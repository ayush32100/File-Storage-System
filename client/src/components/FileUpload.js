import { useState, useEffect } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setUploadProgress(0); 

    try {
      const formData = new FormData();
      formData.append("file", file);

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: `2456ef986c3bd975f3f9`,
          pinata_secret_api_key: `bf26757b5b375d118eb78f011e577872325bb42b812fbb320b727e645408147d`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
      await contract.add(account, ImgHash);

      setPopupMessage("✅ File Uploaded Successfully!");
      setShowPopup(true);
      setFileName("No image selected");
      setFile(null);
    } catch (e) {
      setPopupMessage("❌ Unable to upload file ");
      setShowPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(data);
    };
    setFileName(data.name);
    e.preventDefault();
  };

  return (
    <div className={`top ${isLoading ? "loading" : ""}`}>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          disabled={!account || isLoading}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">Image: {fileName}</span>
        <button type="submit" className="upload" disabled={!file || isLoading}>
          {isLoading ? "Uploading..." : "Upload File"}
        </button>
      </form>

      {/* Progress Bar */}
      {isLoading && (
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${uploadProgress}%` }}
            >
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Popup Notification */}
      {showPopup && (
        <div className="popup hacker-style">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
