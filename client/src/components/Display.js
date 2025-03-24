import { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  const getdata = async () => {
    setLoading(true);
    let dataArray;
    const Otheraddress = document.querySelector(".address").value.trim();

    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress);
      } else {
        dataArray = await contract.display(account);
      }
      console.log("Fetched Data:", dataArray);
    } catch (e) {
      alert("You don't have access");
      setLoading(false);
      return;
    }

    setLoading(false);

    const isEmpty = !dataArray || Object.keys(dataArray).length === 0;

    if (!isEmpty) {
      const str_array = dataArray.toString().split(",");
      const images = str_array.map((item, i) => {
        const fileUrl = `https://gateway.pinata.cloud/ipfs/${item.substring(34)}`;
        const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(item);

        return isImage ? (
          <a href={fileUrl} key={i} target="_blank" rel="noopener noreferrer">
            <img src={fileUrl} alt={`File ${i + 1}`} className="image-list" />
          </a>
        ) : (
          <div key={i}>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="pdf-link">
              📄 {`File ${i + 1}`}
            </a>
          </div>
        );
      });

      setData(images);
    } else {
      alert("No image to display");
    }
  };

  return (
    <>
      <div className="image-list">{loading ? <p>Loading...</p> : data}</div>
      <input type="text" placeholder="Enter Address" className="address" />
      <button className="center button" onClick={getdata}>
        Get Data
      </button>
    </>
  );
};

export default Display;