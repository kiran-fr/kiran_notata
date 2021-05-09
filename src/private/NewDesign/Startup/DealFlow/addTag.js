import React from "react";
import { Tags } from "Components/UI_Kits/Tags/Tags";
import Modal from "./modal";

export default function AddTag({ closeModal }) {
  return (
    <Modal title="Add Tags" closeModal={closeModal}>
      <div className="addTagMain">
        <Tags
          suggested={true}
          items={[
            { name: "software", id: "4" },
            { name: "saas", id: "23" },
            { name: "finance", id: "34" },
            { name: "automotive", id: "17" },
            { name: "software", id: "47" },
            { name: "SaaS", id: "233" },
            { name: "IT Industry", id: "377" },
            { name: "Mechanical", id: "347" },
          ]}
        />
      </div>
    </Modal>
  );
}