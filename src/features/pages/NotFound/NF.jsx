import { Link } from 'react-router-dom'; 

function NotFound() {
  return (
    <div className="not-found-container"> {}
      <h2>404 - Page Not Found</h2> {}
      <p>The page you are looking for does not exist.GO SOMEWHERE ELSE go jog on</p>
      <Link to="/">Go to Home</Link> {}
    </div>
  );
}

export default NotFound; 
