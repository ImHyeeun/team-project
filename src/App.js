import { useEffect, useState } from 'react';
import './App.css';
import { BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer } from 'recharts';

function fetchData(year) {
  const promise = fetch(`https://apis.data.go.kr/1352000/ODMS_STAT_47/callStat47Api?serviceKey=HrxeLyur5UTHFwvxAP30OXS58zNQRrw5rIKkLjFi6Dt9gsSON2EkC6tGafvPSJGiQkfl2gVsYh6KKYkyM3d1kQ%3D%3D&pageNo=1&numOfRows=10&apiType=JSON&year=${year}`)
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      return res.json()
    })
    
    
    return promise;
}


export default function App() {

  const years = [2008, 2011, 2014, 2017];
  const [year, setYear] = useState(years[0]);

  return (
  <>

  <nav>
    <section>
      
      <div id="select-year">
        <select onChange={(e) => setYear(e.target.value)}>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select><h1>년도</h1>
      </div>
    </section>
  </nav>
  
  <main>
  <h1>년도별 노인 남녀 통계</h1>
  <Dashboard year ={year}/>
  </main>

</>

)}

function Dashboard({year}) {  

  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetchData(year)
      .then(data => {
        console.log(data)
        setData(data)
      })
      .catch(error => {
        console.error(error)
      })
      .finally(() => setIsLoaded(true))
  }, [year])

  if (error) {
    return <p>failed to fetch</p>
  }

  if (!isLoaded) {
    return <p>fetching data...</p>
  }

  return (
    <>
      

      
      <p>{year}년도의 노인남녀 통계(비율): {data.totalCount > 0 ? (
        <>
          {/* DATA를 합성된 컴포넌트에 전달한다 */}
          <Rechart items={data.items} />
        </>
      ) : (
        <p>자료가 없습니다</p>
      )}</p>
            <p>{year}년도의 노인남녀 통계(명): {data.totalCount > 0 ? (
        <>
          {/* DATA를 합성된 컴포넌트에 전달한다 */}
          <Recharttwo items={data.items} />
        </>
      ) : (
        <p>자료가 없습니다</p>
      )}</p>

      {/* <ul>
        {data.items.map(item => (
          <>

          <li><p>년도</p>{item.year}</li>
          <li><p>성별남자비율</p>{item.gndrManRt}</li>
          <li><p>성별여자비율</p>{item.gndrFmleRt}</li>

          <li><p>성별남자수</p>{item.gndrManNm}</li> 
          <li><p>성별여자수</p>{item.gndrFmleNm}</li>
     
          </>
        ))}
      </ul> */}
      
    </>
  )
}


function Rechart({ items }) {

  // 리차트가 요구하는 형식에 맞게 데이터를 구성한다
  const chartData = items.map(item => {

    return {
      "노인남자비율(%)": item.gndrManRt,
      "노인여자비율(%)": item.gndrFmleRt,

      성별남자수: item.gndrManNm,
      성별여자수: item.gndrFmleNm,       
    }
  })

  return (
    <div style={{ height: "300px" }}>
      <ResponsiveContainer width="50%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="노인남자비율(%)" fill="#0af" />
          <Bar dataKey="노인여자비율(%)" fill="#fa0" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}


function Recharttwo({ items }) {

  // 리차트가 요구하는 형식에 맞게 데이터를 구성한다
  const chartData = items.map(item => {

    return {
      "성별남자비율(%)": item.gndrManRt,
      "성별여자비율(%)": item.gndrFmleRt,

      노인남자수: item.gndrManNm,
      노인여자수: item.gndrFmleNm,
      
    }
  })

  return (
    <div style={{ height: "300px" }}>
      <ResponsiveContainer width="50%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="노인남자수" fill="#00f" />
          <Bar dataKey="노인여자수" fill="#f00" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}


