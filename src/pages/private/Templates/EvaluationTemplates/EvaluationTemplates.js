import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";

import {
  Card,
  Button,
  Table,
  Content,
  Modal,
  BreadCrumbs,
  GhostLoader,
} from "Components/elements";

import { delete_bucket } from "./EvaluationTemplates.module.css";

import { evaluationTemplatesGet } from "Apollo/Queries";

import {
  evaluationTemplatePut,
  evaluationTemplateDelete,
} from "Apollo/Mutations";

import {
  settings,
  evaluation_template,
  evaluation_templates,
} from "pages/definitions";

function Delete({ id, templates }) {
  const [mutate, { loading }] = useMutation(evaluationTemplateDelete, {
    // refetchQueries: [{ query: accountGet }],
    refetchQueries: [{ query: evaluationTemplatesGet }],
    awaitRefetchQueries: true,
  });

  let template = (templates || []).find(t => t.id === id);

  return (
    <div
      onClick={() => {
        if (loading) return;
        if (template && template.sections && template.sections.length) {
          return window.alert(
            "You have to delete all the section before you can delete the template"
          );
        }
        let variables = { id };
        mutate({ variables });
      }}
    >
      {(loading && <i className="fa fa-spinner fa-spin" />) || (
        <i className="fal fa-trash-alt" />
      )}
    </div>
  );
}

const CreateNewTemplate = ({ setShowModal }) => {
  const [mutate] = useMutation(evaluationTemplatePut);
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async ({ variables }, event) => {
    try {
      await mutate({
        variables,
        update: (proxy, { data: { evaluationTemplatePut } }) => {
          const data = proxy.readQuery({
            query: evaluationTemplatesGet,
          });
          proxy.writeQuery({
            query: evaluationTemplatesGet,
            data: {
              accountGet: {
                ...data.accountGet,
                evaluationTemplates: [
                  evaluationTemplatePut,
                  ...data.accountGet.evaluationTemplates,
                ],
              },
            },
          });
        },
      });

      setShowModal(false);
      event.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
      <div style={{ marginTop: "30px" }}>
        <input
          type="text"
          placeholder={`I.e. "Early Stage Companies"`}
          autoComplete="off"
          ref={register({ required: true })}
          name="variables.input.name"
        />

        <div
          style={{
            marginTop: "5px",
            textAlign: "right",
          }}
        >
          <Button type="input" value="OK" loading={isSubmitting} />
        </div>
      </div>
    </form>
  );
};

// function SharedWithMe() {
//   console.log("SharedWithMe");
//   const { data, loading, error } = useQuery(groupsGet);

//   if (error) {
//     return <span />;
//   }

//   if (loading && !data) {
//     return <span />;
//   }

//   let groups = data.groupsGet;
//   let templates = [];

//   if (groups) {
//     for (let group of groups) {
//       templates = templates.concat(group.evaluationTemplates || []);
//     }
//   }

//   let groupsWithTemplates = groups.filter(
//     ({ evaluationTemplates }) =>
//       evaluationTemplates && evaluationTemplates.length
//   );

//   if (!templates.length) {
//     return <span />;
//   }

//   return (
//     <Card style={{ paddingTop: "5px" }} title="SHARED WITH ME">
//       {groupsWithTemplates.map(group => {
//         return (
//           <div key={group.id}>
//             <div>{group.name}</div>

//             {group.evaluationTemplates}
//           </div>
//         );
//       })}

//       <pre>{JSON.stringify(templates, null, 2)}</pre>
//     </Card>
//   );
// }

export default function EvaluationTemplates(props) {
  const [showModal, setShowModal] = useState(false);
  const { data, loading, error } = useQuery(evaluationTemplatesGet);

  if (error) {
    console.log("error", error);
    return <div>We are updating </div>;
  }

  let templates;
  if (data) {
    let { evaluationTemplates } = data.accountGet;
    templates = evaluationTemplates;
  }

  if (loading && !data) {
    return <GhostLoader />;
  }

  const columns = [
    {
      title: "",
      dataIndex: "id",
      key: "delete",
      width: 20,
      className: delete_bucket,
      render: id => <Delete id={id} templates={templates} />,
    },

    {
      title: "Template name",
      dataIndex: "id",
      key: "name",
      render: id => {
        let template = templates.find(t => t.id === id) || {};
        let { name, sections } = template;
        return (
          <span>
            <div>{name}</div>
            <div style={{ opacity: 0.5, fontSize: "12px" }}>
              {(sections || []).length} sections
            </div>
          </span>
        );
      },
    },

    {
      title: "",
      dataIndex: "id",
      key: "id",
      width: 30,
      render: id => (
        <Button
          //type="tiny_right"
          type="right_arrow"
          size="small"
          onClick={() => {
            let path = `${evaluation_template}/${id}`;
            props.history.push(path);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "Settings",
            link: settings,
          },
          {
            val: "Evaluation templates",
            link: `${evaluation_templates}`,
          },
        ]}
      />
      <Content maxWidth={600}>
        <h1>Evaluation templates</h1>

        <Card style={{ paddingTop: "5px" }}>
          <Table
            dataSource={templates || []}
            columns={columns}
            loading={loading.toString()}
            disableHead={true}
          />
        </Card>

        {/*
            <SharedWithMe />
          */}

        <div style={{ marginTop: "20px" }}>
          <Button
            onClick={() => setShowModal(true)}
            type="right_arrow"
            size="large"
          >
            New Evaluation Template
          </Button>
        </div>

        {showModal && (
          <Modal
            title="New Evaluation Template"
            close={() => setShowModal(false)}
            disableFoot={true}
          >
            <CreateNewTemplate setShowModal={setShowModal} />
          </Modal>
        )}
      </Content>
    </>
  );
}
