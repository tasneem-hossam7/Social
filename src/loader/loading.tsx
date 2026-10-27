import { Hearts } from 'react-loader-spinner';


export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
  <Hearts
    height="100"
    width="100"
    color="#f472b6"
    ariaLabel="hearts-loading"
    wrapperStyle={{}}
    wrapperClass=""
    visible={true}
  />
</div>
  )
}
