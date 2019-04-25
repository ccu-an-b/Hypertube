import React from 'react';
import { Link } from 'react-router-dom';
import { imgPath } from 'helpers';
import TimeAgo from 'react-timeago';
import movieService from 'services/movies-services';

export default class Comment extends React.Component {
  constructor(){
      super();
      this.state={  
        new_comment:"",
        comments: [],
      }
  }

  componentDidMount(){
      this.setState({comments: this.props.comments});
  }

  renderComments = (comments) =>{
      return comments.map((comment, index) => {
          return(
            <div className="one-comment" key={index}>
            <Link to={`/profile/${comment.userId.login}`}>
                <img className="profile-img" src={imgPath(comment.userId.img)} alt="profile_img"/>
            </Link>
                <div className='comment-content'>
                    <h4>{comment.userId.login}<span><TimeAgo date={comment.timestamp}/></span></h4>
                    <p>{comment.comment}</p>
                </div>
                {comment.userId.login === this.props.user.login &&
                    <i className="fas fa-times" onClick={() => this.deleteComment(comment._id, comment.movieId)}></i>
                }
            </div>
          )
      })
  }

  NewCommentTyping = (event) => {
    this.setState({new_comment: event.target.value})
  }

  addComment = (movieId) => {
    return movieService.addComment({comment: this.state.new_comment, movieId})
    .then((comments) => this.setState({comments, new_comment:""}))
  }

  deleteComment = (id, movieId) => {
    return movieService.deleteComment(id, movieId)
    .then((comments) => this.setState({comments}))
  }

  render() {
    const {user, movieId} = this.props;
    const {new_comment, comments} = this.state;

    return (
          
    <div className="comments-container">
        <h1>Comments</h1>
        {this.renderComments(comments)}
        <div className="add-comment">
            <Link to={`/profile/${user.login}`}>
                <img className="profile-img" src={imgPath(user.img)} alt="profile_img"/>
            </Link>
            <div className="submit-comment">
                <input  type="text" 
                        placeholder="Add Comment"
                        value={new_comment}
                        onChange={this.NewCommentTyping}/>
                <div onClick={() => this.addComment(movieId)} className={new_comment.length ? "submit active" : "submit"}>Comment</div>
            </div>
        </div>
        
    </div>

    )
  }
}
