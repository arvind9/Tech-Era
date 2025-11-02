import {Link} from 'react-router-dom'
import './index.css'

const CouseItem = props => {
  const {courseDetails} = props
  const {id, name, logoUrl} = courseDetails

  return (
    <Link to={`/courses/${id}`} className="link-item">
      <li className="list-item">
        <img src={logoUrl} alt={name} className="course-logo" />
        <p className="name">{name}</p>
      </li>
    </Link>
  )
}

export default CouseItem
