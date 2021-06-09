import { Storage } from "aws-amplify";
import React, { useRef, useState } from "react";
const publicFilePath = `https://s3-eu-west-1.amazonaws.com/notata.userfiles/public/`;

async function removeLogoPromise(key, config) {
  return new Promise((resolve, reject) => {
    Storage.remove(key, config).then(resolve).catch(reject);
  });
}

async function uploadLogoPromise(filename, file, setProgress) {
  return new Promise((resolve, reject) => {
    Storage.put(filename, file, {
      progressCallback(progress) {
        if (setProgress) {
          setProgress({
            loaded: progress.loaded,
            total: progress.total,
          });
        }
      },
      level: "public",
    })
      .then(resolve)
      .catch(reject);
  });
}

export default function FileUploader({ creative, saveCreative, setLogo }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const folderPath = `${creative?.id}/`;
  const formRef = useRef(null);
  const [progress, setProgress] = useState();

  async function handleUpload(e) {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    // Get file
    let file = e.target.files[0];

    // Return if no file
    if (!file) {
      return;
    }

    // Get file size
    let filesize = (file.size / 1024 / 1024).toFixed(4); // MB

    // Do not allow pictures larger than one mb
    if (filesize >= 1) {
      return;
    }

    // Get the file name parts
    let split = file.name.split(".");

    // Save as logo.ext
    let name = `logo.` + split[split.length - 1];

    // Get path and file name together
    const filename = `${folderPath}${name}`;

    // Save file to s3
    let result;
    try {
      result = await uploadLogoPromise(filename, file, setProgress());
    } catch (error) {
      setIsLoading(false);
      console.log("error", error);
      return;
    }

    let { key } = result;
    let path = `${publicFilePath}${key}`;

    // Save file in DB
    if (creative.id) {
      try {
        await saveCreative({ logo: path });
      } catch (error) {
        setIsLoading(false);
        console.log("error2", error);
        return;
      }
    }

    if (!creative.id) {
      setLogo(path);
    }

    setIsLoading(undefined);
  }

  async function handleDelete() {
    if (isDeleting) {
      return;
    }
    setIsDeleting(true);

    let parts = creative?.logo?.split("/");
    let key = `/${parts[parts.length - 2]}/${parts[parts.length - 1]}`;

    try {
      await removeLogoPromise(key, { level: "public" });
    } catch (error) {
      console.log("error", error);
    }

    if (creative.id) {
      try {
        await saveCreative({ removeLogo: true });
      } catch (error) {
        console.log("error", error);
      }
    }

    if (!creative.id) {
      setLogo(false);
    }

    setIsDeleting(false);

    if (formRef.current) {
      formRef.current.reset();
    }
  }

  return (
    <div className="col-sm-10 col-xs-9">
      <div className="row">
        <div className="col-sm-12 col-md-5 col-lg-4">
          <div className="hidden-file-input">
            <form ref={formRef}>
              <label htmlFor="file-upload" className="upload-logo-btn">
                <input
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={handleUpload}
                />
                <span>
                  {(!isLoading && <span>UPLOAD LOGO</span>) || (
                    <span>UPLOADING...</span>
                  )}
                </span>
              </label>
            </form>
          </div>
        </div>

        {creative?.logo && (
          <div className="col-sm-12 col-md-5 col-lg-4">
            <button className="delete-btn" onClick={handleDelete}>
              {(!isDeleting && <span>DELETE LOGO</span>) || (
                <span>DELETING...</span>
              )}
            </button>
          </div>
        )}

        {/*<div>*/}
        {/*  {progress && (*/}
        {/*    <div>*/}
        {/*      {Math.round(progress.loaded / progress.total * 100)}*/}
        {/*    </div>*/}
        {/*  )}*/}
        {/*</div>*/}

        <div>
          {/*<input*/}
          {/*  type="file"*/}
          {/*  accept="image/png, image/gif, image/jpeg"*/}
          {/*  onChange={handleUpload}*/}
          {/*/>*/}
        </div>
      </div>
    </div>
  );
}
