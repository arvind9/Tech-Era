import {Component} from 'react'
import Loader from 'react-loader-spinner'
// import Failure from '../Failure'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
}

class CourseItemDetails extends Component {
  state = {apiStatus: apiStatusConstants.initial, courseDetails: {}}

  componentDidMount() {
    this.getCourseDetails()
  }

  getCourseDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/te/courses/${id}`
    const urlResponce = await fetch(url)
    if (urlResponce.ok === true) {
      const courseUrlResponce = await urlResponce.json()
      const courseDetails = courseUrlResponce.course_details
      console.log(courseDetails)
      const formatedCourseDetails = {
        id: courseDetails.id,
        description: courseDetails.description,
        imageUrl: courseDetails.image_url,
        name: courseDetails.name,
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        courseDetails: {...formatedCourseDetails},
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  loader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" height={40} width={40} color="#1e293b" />
    </div>
  )

  courseDetails = () => {
    const {courseDetails} = this.state
    const {name, description, imageUrl} = courseDetails

    return (
      <div className="course-details-container">
        <div className="card-container">
          <img src={imageUrl} alt={name} className="course-image" />
          <div className="course-desc-container">
            <h1 className="course-name">{name}</h1>
            <p className="course-desc">{description}</p>
          </div>
        </div>
      </div>
    )
  }

  onClickRetry = () =>
    this.setState(
      {apiStatus: apiStatusConstants.initial},
      this.getCourseDetails,
    )

  failureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt="failure view"
        className="failure-logo"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  apiResults = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.loader()
      case apiStatusConstants.success:
        return this.courseDetails()
      case apiStatusConstants.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.apiResults()}
      </div>
    )
  }
}

export default CourseItemDetails
