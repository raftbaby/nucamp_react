import React from 'react';
import { Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LocalForm, Control, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';
 
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);


//Descriptive picture
    function RenderCampsite({campsite}) {
         return(
            <div className="col-md-5 m-1">
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                    <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        </div>
        );
    }
//Comments formatting
function RenderComments({comments, postComment, campsiteId}) {
        if(comments){
            return(
                <div className="col-md-5 m-1"> 
                   <h4>Comments</h4>
                <Stagger in>
                    {comments.map(comment => {
                        return (
                            <Fade in key={comment.id}>
                                <div>
                                    <p>{comment.text}<br />
                                        -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                                    </p>
                                </div>
                            </Fade>
                        );
                    })}
                </Stagger>
                <CommentForm campsiteId={campsiteId} postComment={postComment} />
                </div>
            );
        }
        return <div />;
    }
//Selected Campsite Panel
    function CampsiteInfo(props) {
        if (props.isLoading) {
            return (
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            );
        }
        if (props.errMess) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h4>{props.errMess}</h4>
                        </div>
                    </div>
                </div>
            );
        }
        
        if (props.campsite) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <Breadcrumb>
                                <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                                <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                            </Breadcrumb>
                            <h2>{props.campsite.name}</h2>
                            <hr />
                        </div>
                    </div>
                    <div className="row">
                        <RenderCampsite campsite={props.campsite} />
                        <RenderComments 
                        comments={props.comments}
                        postComment={props.postComment} 
                        campsiteId={props.campsite.id}
                    />
                    </div>
                </div>
            );
        }
        return <div />;
    }

    //Comment Form
    class CommentForm extends React.Component{
        constructor(props) {
            super(props);
            this.state = {
                isModalOpen: false,
                rating: '5',
                author:'',
                comment: '',
                touched: {
                    rating: false,
                    name:false,
                    comment:false
                }
            };
//            
            this.toggleModal = this.toggleModal.bind(this);
            this.handleInputChange = this.handleInputChange.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
        }
//
        handleInputChange(event) {
            const target = event.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
        
            this.setState({
              [name]: value
            });
        }
 //Does whatever described with Submitted information (on the Sumbit Click) called for below   
        handleSubmit(values) {
            this.toggleModal();
            this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
            }
            
//turns Modal on/off
        toggleModal() {
            this.setState({
                isModalOpen: !this.state.isModalOpen
            });
        }

//Error filter and description        REDUNDANT CODE
      /*  validate(author) {
            const errors = {
                author: '',
            };
            if (this.state.touched.author) {
                if (author.length < 2) {
                    errors.author = 'Last name must be at least 2 characters.';
                } else if (author.length > 15) {
                    errors.author = 'Last name must be 15 or less characters.';
                }
            }
            return errors;
        }
    */
        render() {
            //populates specific error
            //const errors = this.validate(this.state.author);    
            
            return(
                <React.Fragment>
                    {//Modal Button
                    }
                <Button onClick={this.toggleModal} outline color= "secondary"><i class= "fa fa-pencil"></i> Submit Comment</Button> 
                    {//Modal
                    }           
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}> {//calls onclick toggle
                }
                <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>                   
                <LocalForm onSubmit={values => this.handleSubmit(values)}> {//submit button action
                }
                            <div className= "form-group">
                                {//Rating dropdown
                                }
                                <Label htmlFor="rating">Rating</Label>
                                <Control.select model=".rating" id="rating" name="rating" className="form-control">
                                    <option></option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Control.select>
                            </div>
                            <div className = "form-group">
                                {//Author input
                                }
                                <Label htmlFor="author">Your Name</Label>
                                <Control.text model=".author" id="author" name="author" placeholder="Your Name" className="form-control"
                                        validators={{
                                            minLength: minLength(2),
                                            maxLength: maxLength(15)
                                        }}
                                    />
                                    <Errors
                                        className="text-danger" model=".author" show="touched" component="div"
                                        messages={{
                                            minLength: 'Must be at least 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                            </div>
                            <div className ="form-group">
                                {//Comment input
                                }
                                <Label htmlFor="comment">Comment</Label>
                                <Control.textarea model=".comment" id="comment" name="comment" className="form-control"/>
                                <br/>
                                {//Submit Button
                                }
                                <Button type="submit" color="primary">Submit</Button>
                            </div>
                        </LocalForm>
                    </ModalBody>
                </Modal>
                </React.Fragment>
            );
        }
    }
    

    
    
    export default CampsiteInfo;