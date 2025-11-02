import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
// import Failure from '../Failure'
import './index.css'
import CourseItem from '../CourseItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {apiStatus: apiStatusConstants.initial, courseData: []}

  componentDidMount() {
    this.getCourseData()
  }

  getCourseData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const coursesUrl = 'https://apis.ccbp.in/te/courses'
    const recivedCourseData = await fetch(coursesUrl)
    if (recivedCourseData.ok === true) {
      const coursesData = await recivedCourseData.json()
      const formatedCoursesData = coursesData.courses.map(eachCourse => ({
        id: eachCourse.id,
        logoUrl: eachCourse.logo_url,
        name: eachCourse.name,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        courseData: formatedCoursesData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" height={70} width={70} color="#1e293b" />
    </div>
  )

  courseResult = () => {
    const {courseData} = this.state

    return (
      <>
        <div className="home-bg-container">
          <h1>Courses</h1>
          <ul className="course-container">
            {courseData.map(eachCourse => (
              <CourseItem key={eachCourse.id} courseDetails={eachCourse} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  onClickRetry = () =>
    this.setState({apiStatus: apiStatusConstants.initial}, this.getCourseData)

  apiFailureView = () => (
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
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.courseResult()
      case apiStatusConstants.failure:
        return this.apiFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <Header />
        {this.apiResults()}
      </div>
    )
  }
}

export default Home
