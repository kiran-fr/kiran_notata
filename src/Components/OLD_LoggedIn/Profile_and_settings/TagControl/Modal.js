import {
  modal_class,
  modal_class_inner,
  modal_container,
  close_modal,
  delete_tag,
  delete_tag_warning
} from './Modal.module.css';




// *******************************
// * MODAL TO EDIT OR DELETE TAG *
// *******************************
class Modal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      deleting: false
    }
  }

  render() {

    let { tag, show, close, updatedTag, deletedTag } = this.props;

    if (!show || !tag) return <span/>

    return (
      <div className={modal_class}>
        <div className={modal_class_inner}>
          <div className={modal_container}>

            <div
              className={close_modal}
              onClick={() => close()}
              >
              Close
            </div>
            
            <EditTag
              index={tag.index}
              groupId={tag.group || 'no_group'}
              tag={tag}
              setVal={nVal => {
                updatedTag(nVal)
                this.setState({loading: false})
              }}
              setLoading={() => {
                this.setState({loading: true})
              }}
            />


            <Mutation mutation={deleteTag}>
              {(mutate, { data, loading, error }) => {
                if (!loading && !error && data && this.state.loading) {
                  this.setState({loading: false, deleting: false})
                  this.props.deletedTag(tag)
                }

                return (
                  <div
                    className={delete_tag}
                    onClick={() => {
                      if (window.confirm(
                          tag.tag_type
                            ? "Are you sure you want to delete this tag group?."
                            : "Are you sure you want to delete this tag and remove it from all items it's been added to? This action cannot be undone."
                        )) {
                        this.setState({loading: true, deleting: true})
                        let variables = { id: tag.id }
                        mutate({variables})
                      } else { /* Do nothing */ }
                    }}
                    >
                    {
                      tag.tag_type
                        ? "Delete tag group" 
                        : "Delete tag permanently"
                    }
                  </div>
                )

              }}
            </Mutation>

            <div className={delete_tag_warning}>
              {
                tag.tag_type
                ? "No tags will be deleted. All tags within this group will be transfered to the \"ungrouped section\""
                : "This will permanently remove tag from all items you've added it to previously."
              }
            </div>
          </div>

          {
            this.state.deleting && (
              <GhostLoader />
            )
          }


        </div>
      </div>
    )
  }
}