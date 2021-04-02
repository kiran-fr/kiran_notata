import React, { useState } from "react";

import { InputForm } from "Components/UI_Kits";
import { Dropdown } from "Components/UI_Kits";
import { Content, Card } from "Components/elements";
import { Button } from "Components/UI_Kits";
import { Tags } from "Components/UI_Kits";
import { DatePickers } from "Components/UI_Kits";

export default function UI_Components() {
  const listForm = ["email", "password", "number", "url", ""];
  const [position, setPosition] = useState(4);
  const [validate, setValidate] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2014-08-18");

  const setNextFlag = index => {
    console.log("ee");
    if (index != "url") {
      setPosition(index === "email" ? 1 : index === "password" ? 2 : 3);
    }
  };

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  return (
    <>
      <Content
        maxWidth={600}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div>
          <h1 style={{ fontWeight: "500" }}>INPUT</h1>

          <InputForm
            label="Email"
            inputType="email"
            placeholder="Email"
            position={listForm[position]}
            setNextFlag={setNextFlag}
            validate={validate}
            required
          />

          <InputForm
            label="Password"
            inputType="password"
            placeholder="Password"
            position={listForm[position]}
            setNextFlag={setNextFlag}
            validate={validate}
          />

          <InputForm
            label="Mobile Number"
            inputType="number"
            placeholder="Mobile Number"
            position={listForm[position]}
            setNextFlag={setNextFlag}
            validate={validate}
          />

          <InputForm
            label="Website"
            inputType="url"
            placeholder="Website"
            position={listForm[position]}
            setNextFlag={setNextFlag}
            validate={validate}
          />
          <div style={{ marginBottom: "60px" }}>
            <Button
              buttonStyle="secondary"
              size="large"
              onClick={() => {
                setValidate(true);
              }}
            >
              {" "}
              submit
            </Button>
          </div>
        </div>

        <div
          style={{
            marginTop: "30px",
          }}
        >
          <Dropdown
            title="xxx"
            items={[
              { title: "xxx", id: "123" },
              { title: "yyy", id: "134" },
            ]}
          />
        </div>
        <div
          style={{
            marginTop: "50px",
          }}
        >
          <Tags
            title="xxx"
            items={[
              { name: "shirisha", id: "12" },
              { name: "Martin", id: "13" },
              { name: "Ane", id: "3" },
              { name: "jørgen", id: "14" },
              { name: "authentication", id: "1" },
              { name: "yyy", id: "4" },
              { name: "xxx", id: "23" },
              { name: "yyy", id: "34" },
              { name: "xxx", id: "17" },
              { name: "yyy", id: "47" },
              { name: "xxx", id: "233" },
              { name: "yyy", id: "347" },
            ]}
          />
        </div>
        <div
          style={{
            marginTop: "50px",
          }}
        >
          <Tags
            title="xxx"
            size="smallInput"
            tagSize="smallTagSize"
            tagName="smallTagName"
            closeIcon="smallCloseIcon"
            ulSize="smallULSize"
            tagButtons="smallButtons"
            items={[
              { name: "shirisha", id: "12" },
              { name: "Martin", id: "13" },
              { name: "Ane", id: "3" },
              { name: "jørgen", id: "14" },
              { name: "authentication", id: "1" },
              { name: "yyy", id: "4" },
              { name: "xxx", id: "23" },
              { name: "yyy", id: "34" },
              { name: "xxx", id: "17" },
              { name: "yyy", id: "47" },
              { name: "xxx", id: "233" },
              { name: "yyy", id: "347" },
            ]}
          />
        </div>
      </Content>

      <div
        style={{
          marginTop: "50px",
          marginBottom: "50px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Card>
          <div style={{ position: "relative" }}>
            <Button size="large">large</Button>
          </div>

          <div style={{ position: "relative" }}>
            <Button size="large1">large1</Button>
          </div>

          <div style={{ position: "relative" }}>
            <Button size="medium">medium</Button>
          </div>

          <div style={{ position: "relative" }}>
            <Button size="medium1">medium1</Button>
          </div>

          <div style={{ position: "relative" }}>
            <Button size="medium2">medium2</Button>
          </div>

          <div style={{ position: "relative" }}>
            <Button size="small">small</Button>
          </div>

          <div style={{ position: "relative" }}>
            <Button size="small1">small1</Button>
          </div>

          <div style={{ position: "relative" }}>
            <Button size="small2">small2</Button>
          </div>

          <div style={{ position: "relative" }}>
            <Button size="extra-small">extra-small</Button>
          </div>

          <div style={{ position: "relative" }}>
            <Button size="extra-small1">extra-small1</Button>
          </div>

          <div style={{ position: "relative" }}>
            <Button size="text-button">text-button</Button>
          </div>
        </Card>

        <div
          style={{
            marginTop: "50px",
            marginBottom: "50px",
            padding: "20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {/* large buttons */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "60px" }}>
              <Button buttonStyle="primary" size="large">
                {" "}
                primary
              </Button>
            </div>

            <div style={{ marginBottom: "60px" }}>
              <Button buttonStyle="secondary" size="large">
                {" "}
                secondary
              </Button>
            </div>

            <div style={{ marginBottom: "60px" }}>
              <Button buttonStyle="gray" size="large">
                {" "}
                gray
              </Button>
            </div>

            <div style={{ marginBottom: "60px" }}>
              <Button buttonStyle="white" size="large">
                {" "}
                white
              </Button>
            </div>
          </div>

          {/* small buttons */}
          <div>
            <div style={{ marginBottom: "40px" }}>
              <Button buttonStyle="primary" size="extra-small" type="check">
                {" "}
                save
              </Button>
            </div>
            <br />
            <div style={{ marginBottom: "40px" }}>
              <Button buttonStyle="secondary" size="extra-small" type="check">
                {" "}
                save
              </Button>
            </div>
            <br />
            <div style={{ marginBottom: "40px" }}>
              <Button buttonStyle="gray" size="extra-small" type="check">
                {" "}
                save
              </Button>
            </div>
            <br />
            <div style={{ marginBottom: "30px" }}>
              <Button buttonStyle="white" size="extra-small" type="check">
                {" "}
                save
              </Button>
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "50px",
            marginBottom: "50px",
            padding: "20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {/* medium buttons */}
          <div>
            <div style={{ marginBottom: "40px" }}>
              <Button
                buttonStyle="primary"
                size="medium"
                hover="primary_hover"
                type="plus"
              >
                {" "}
                add new startup
              </Button>
            </div>
            <br />
            <div style={{ marginBottom: "40px" }}>
              <Button
                buttonStyle="secondary"
                size="medium"
                hover="secondary_hover"
                type="plus"
              >
                add new startup
              </Button>
            </div>
            <br />
            <div style={{ marginBottom: "40px" }}>
              <Button
                buttonStyle="gray"
                size="medium"
                hover="gray_hover"
                type="plus"
              >
                add new startup
              </Button>
            </div>
            <br />
            <div style={{ marginBottom: "50px" }}>
              <Button
                buttonStyle="white"
                size="medium"
                hover="white_hover"
                type="plus"
              >
                add new startup
              </Button>
            </div>
            <br />
            <div style={{ marginBottom: "40px" }}>
              <Button buttonStyle="secondary" size="extra-small1">
                {" "}
                +
              </Button>
            </div>
          </div>

          {/* small buttons */}
          <div>
            <div style={{ marginBottom: "40px" }}>
              <Button buttonStyle="primary" size="small" type="right_arrow">
                {" "}
                next
              </Button>
            </div>
            <br />
            <div style={{ marginBottom: "40px" }}>
              <Button buttonStyle="secondary" size="small" type="right_arrow">
                next
              </Button>
            </div>
            <br />
            <div style={{ marginBottom: "40px" }}>
              <Button buttonStyle="gray" size="small" type="right_arrow">
                next
              </Button>
            </div>
            <br />
            <div style={{ marginBottom: "30px" }}>
              <Button buttonStyle="white" size="small" type="right_arrow">
                next
              </Button>
            </div>
            <br />
            <div style={{ marginBottom: "40px" }}>
              <Button buttonStyle="white" size="small1" type="left_arrow">
                {" "}
                back
              </Button>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "50px",
            marginBottom: "50px",
            padding: "20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {/* loading */}
          <div>
            <div style={{ marginBottom: "40px" }}>
              <Button buttonStyle="primary" size="medium" loading={true}>
                {" "}
              </Button>
            </div>
            <br />
            <div style={{ marginBottom: "40px" }}>
              <Button
                buttonStyle="secondary"
                size="medium"
                loading={true}
              ></Button>
            </div>
            <br />
            <div style={{ marginBottom: "40px" }}>
              <Button buttonStyle="gray" size="medium" loading={true}></Button>
            </div>
            <br />
            <div style={{ marginBottom: "40px" }}>
              <Button buttonStyle="white" size="medium" loading={true}></Button>
            </div>
            <br />
            <div style={{ marginBottom: "30px" }}>
              <Button buttonStyle="white" size="medium1" type="angle_up">
                <i
                  className="fas fa-share-alt"
                  style={{ paddingRight: "8px" }}
                ></i>
                share back
              </Button>
            </div>
          </div>
          <div>
            <div style={{ marginBottom: "40px" }}>
              <Button
                size="text-button"
                type="angle_down"
                textStyle="primary_text"
              >
                More news
              </Button>
            </div>
            <br />
            <div style={{ marginBottom: "40px" }}>
              <Button
                size="text-button"
                type="angle_down"
                textStyle="secondary_text"
              >
                More news
              </Button>
            </div>
            <br />
            <div style={{ marginBottom: "40px" }}>
              <Button
                size="text-button"
                type="angle_down"
                textStyle="gray_text"
              >
                More news
              </Button>
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "50px",
            marginBottom: "50px",
            padding: "20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <div>
            <div style={{ marginBottom: "40px" }}>
              <Button buttonStyle="secondary" size="small2">
                ok
              </Button>
            </div>
            <br />
            <div style={{ marginBottom: "40px" }}>
              <Button size="small2" buttonStyle="white">
                edit
              </Button>
            </div>
          </div>

          <div>
            <div style={{ marginBottom: "40px" }}>
              <Button buttonStyle="secondary" size="medium2">
                sign up
              </Button>
            </div>
            <br />
            <div style={{ marginBottom: "40px" }}>
              <Button size="medium2" buttonStyle="white">
                sign in
              </Button>
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "50px",
            marginBottom: "50px",
            padding: "20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <div>
            <div style={{ marginBottom: "40px" }}>
              <Button buttonStyle="secondary" size="large1">
                submit
              </Button>
            </div>
            <br />
            <div style={{ marginBottom: "40px" }}>
              <Button size="small2" buttonStyle="white">
                edit
              </Button>
            </div>
          </div>

          <div>
            <div style={{ marginBottom: "40px" }}>
              <Button buttonStyle="secondary" size="medium2">
                sign up
              </Button>
            </div>
            <br />
            <div style={{ marginBottom: "40px" }}>
              <Button size="medium2" buttonStyle="white">
                sign in
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Card>
        <h1 style={{ fontWeight: "500" }}>Date Picker</h1>
        <div
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <DatePickers
            id={"DatePickers"}
            label={"From"}
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
          />
          <DatePickers
            id={"DatePickers"}
            label={"To"}
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
          />
        </div>
      </Card>
    </>
  );
}
