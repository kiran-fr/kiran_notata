import React, { useEffect, useState } from "react";
import { Modal, Button, Card, Table } from "Components/elements";
import moment from "moment";
import { useLazyQuery, useMutation } from "@apollo/client";
import { externalResourcesGet } from "Apollo/Queries";
import { externalResourcePut, externalResourceDelete } from "Apollo/Mutations";
import { useForm } from "react-hook-form";
import styles from "../StartupPage.module.css";

export function ExternalResources({ connectionId }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(undefined);

  const [getExternalResources, { data, loading }] = useLazyQuery(
    externalResourcesGet
  );

  const [putMutation] = useMutation(
    externalResourcePut
    // {
    // refetchQueries: [
    //   getExternalResources({
    //      variables: { connectionId },
    //    })
    // ]
    // }
  );
  const [deleteMutation] = useMutation(externalResourceDelete);

  const { register, errors, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async ({ label, url }, event) => {
    let variables = {
      connectionId: connectionId,
      input: { label, url },
    };

    try {
      await putMutation({
        variables,

        update: (proxy, { data: { externalResourcePut } }) => {
          const data = proxy.readQuery({
            query: externalResourcesGet,
            variables: { connectionId },
          });

          proxy.writeQuery({
            query: externalResourcesGet,
            variables: { connectionId },
            data: {
              externalResourcesGet: [
                ...data.externalResourcesGet,
                externalResourcePut,
              ],
            },
          });
        },
      });
    } catch (error) {
      return console.log("error", error);
    }

    setShowModal(false);
  };

  useEffect(() => {
    if (connectionId) {
      getExternalResources({
        variables: { connectionId },
      });
    }
  }, [connectionId]);

  let externalResources = data?.externalResourcesGet || [];

  const columns = [
    {
      title: "",
      // dataIndex: "id",
      key: "delete",
      width: 50,
      className: "delete_bucket",
      render: ({ id }) => {
        return (
          <span>
            <i
              className={"fal fa-trash-alt"}
              onClick={() => setShowDeleteModal(id)}
            />
          </span>
        );
      },
    },
    {
      title: "Label",
      // dataIndex: "email",
      key: "label",
      render: ({ label, url }) => {
        return (
          <div className={styles.link}>
            <a href={url} target={"_blank"} rel="noopener noreferrer">
              {label}
            </a>
          </div>
        );
      },
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: "sm",
      width: 250,
      render: createdAt => <span>{moment(createdAt).format("lll")}</span>,
    },
  ];

  return (
    <div>
      <Card label={"EXTERNAL RESOURCES"} noMargin={true}>
        <Table
          loading={loading}
          dataSource={externalResources
            .filter(x => x)
            .sort((a, b) => b.createdAt - a.createdAt)}
          columns={columns}
          disableHead={false}
          pagination={false}
        />
      </Card>

      <div
        style={{
          marginTop: "0px",
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          top: "-40px",
        }}
      >
        <span />
        <Button
          type="right_arrow"
          size="small"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Add new resource
        </Button>
      </div>

      {showDeleteModal && (
        <Modal
          title={"Delete resource"}
          close={() => setShowDeleteModal(undefined)}
          disableFoot={true}
        >
          <div>
            <div
              style={{
                padding: "20px 0px",
                paddingBottom: "30px",
              }}
            >
              Are you sure you want to delete this resource?
            </div>
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button
                size={"medium"}
                buttonStyle={"secondary"}
                onClick={() => setShowDeleteModal(undefined)}
              >
                Cancel
              </Button>

              <Button
                size={"medium"}
                loading={isDeleting}
                onClick={async () => {
                  if (isDeleting) {
                    return;
                  }

                  setIsDeleting(true);

                  try {
                    let variables = { id: showDeleteModal };
                    await deleteMutation({
                      variables,
                      update: proxy => {
                        const data = proxy.readQuery({
                          query: externalResourcesGet,
                          variables: { connectionId },
                        });

                        proxy.writeQuery({
                          query: externalResourcesGet,
                          variables: { connectionId },
                          data: {
                            externalResourcesGet: data.externalResourcesGet.filter(
                              r => r.id !== showDeleteModal
                            ),
                          },
                        });
                      },
                    });
                  } catch (error) {
                    console.log("error", error);
                  }
                  setIsDeleting(false);
                  setShowDeleteModal(undefined);
                }}
              >
                OK
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {showModal && (
        <Modal
          title="Add new resource"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>Link name</label>
              <input
                className={errors["label"] && "form_error"}
                type="text"
                placeholder={"Website name"}
                autoComplete="off"
                ref={register({ required: true })}
                name="label"
              />

              <label>URL</label>
              <input
                className={errors["url"] && "form_error"}
                type="text"
                placeholder={"https://website.com"}
                autoComplete="off"
                ref={register({
                  required: true,
                  pattern: {
                    value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*) ?/gi,
                    message: "That does not look like a URL",
                  },
                })}
                name="url"
              />

              {errors["url"]?.message && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--color-primary)",
                    position: "relative",
                    top: "-5px",
                  }}
                >
                  {errors["url"]?.message}
                </div>
              )}

              <div
                style={{
                  marginTop: "5px",
                  textAlign: "right",
                }}
              >
                {/*<Button*/}
                {/*  buttonStyle={"secondary"}*/}
                {/*  size={"medium"}*/}
                {/*  onClick={() => setShowDeleteModal(undefined)}*/}
                {/*>*/}
                {/*  Cancel*/}
                {/*</Button>*/}
                <span />
                <Button type="input" value="OK" loading={isSubmitting} />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
