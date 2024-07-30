import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import CircularJSON from 'circular-json'
var obj = { foo: 'bar' },
  str;


function App() {
  const ref = useRef()
  const passwordRef = useRef()
  const [form, setform] = useState({ site: "", username: "", password: "" })
  const [passwordArray, setpasswordArray] = useState([])

  const getPasswords = async () => {
    let req = await fetch("http://localhost:3000/")
    let passwords = await req.json()
    setpasswordArray(passwords)
  }



  useEffect(() => {
    getPasswords();

  }, [])

  const showPassword = () => {
    if (ref.current.src.includes('src/assets/openeye.svg')) {
      ref.current.src = 'src/assets/closedeye.svg'
      passwordRef.current.type = 'password'
    }
    else {
      ref.current.src = 'src/assets/openeye.svg'
      passwordRef.current.type = 'type'
    }
  }

  const savePassword = async () => {
    if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {      

      setpasswordArray([...passwordArray, { ...form, id: uuidv4() }])

      
      await fetch("http://localhost:3000/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: uuidv4() }) })

      // Otherwise clear the form and show toast
      setform({ site: "", username: "", password: "" })
      toast('Password saved!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    else {
      toast('Error: Password not saved!');
    }
  }

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value })
  }



  const handleDelete = async (id) => {
    console.log("Deleting password with id ", id)
    let c = confirm("Do you really want to delete this password?")
    if (c) {
      setpasswordArray(passwordArray.filter(item => item.id !== id))

      await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })



      toast('Password Deleted!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      // reload site
      window.location.reload()
    }

  }





  const handleEdit = (id) => {
    setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
    setpasswordArray(passwordArray.filter(item => item.id !== id))

  }

  const handleCopy = (text) => {
    toast('Copied To Clipboard!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigator.clipboard.writeText(text)
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition="Bounce"
      />
      {/* Same as */}
      <ToastContainer />
      <header className='flex justify-between py-4 px-10 items-center'>
        <div className='text-[23px] font-bold'>
          <span className='text-green-500'>&lt;</span>Safe<span className='text-green-500'>Pass/&gt;</span>
        </div>
        <a href="https://github.com/Prajualit">
          <button className='text-[20px] flex items-center space-x-2 font-bold bg-neutral-900 p-2 px-3 rounded-full transition-all duration-300 hover:invert'>
            <img className='invert' width={35} src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="" />
            <span>
              GitHub
            </span>
          </button>
        </a>
      </header>
      <div className='flex flex-col items-center justify-center'>
        <div className='text-[40px] font-bold flex'>
          <span className='text-green-500'>&lt;</span>Safe<span className='text-green-500'>Pass/&gt;</span>
        </div>
        <div className='text-[18px] text-[#b2b2b2] font-light'>The Manager of Your Passwords</div>
      </div>
      <div className='flex items-center justify-center py-4'>

        <div className='flex flex-col justify-center items-center space-y-4 w-full'>
          <input value={form.site} onChange={handleChange} className='bg-neutral-900 outline-none w-9/12 font-light p-3 px-6 rounded-lg placeholder-white' type="text" name='site' placeholder='Enter website URL' />
          <input value={form.username} onChange={handleChange} className='bg-neutral-900 outline-none w-9/12 xl:w-1/4 font-light p-3 px-6 rounded-lg placeholder-white' type="text" name='username' placeholder='Enter the username' />
          <div className='bg-neutral-900 w-9/12 xl:w-1/4 font-light p-3 px-6 rounded-lg flex justify-between'>
            <input ref={passwordRef} value={form.password} onChange={handleChange} name='password' className='placeholder:text-white outline-none bg-transparent' type="password" placeholder='Enter the password' />
            <img ref={ref} className='cursor-pointer' onClick={showPassword} src="src/assets/closedeye.svg" alt="" />
          </div>
          <button onClick={savePassword} className='bg-green-500 font-bold text-[18px] p-2 px-5 rounded-full cursor-pointer duration-300 transition-all hover:bg-white hover:text-black flex items-center justify-center space-x-1'>
            <lord-icon
              src="https://cdn.lordicon.com/ftndcppj.json"
              trigger="morph"
              state="morph-minus"
              colors="primary:#16c72e,secondary:#ebe6ef">
            </lord-icon>
            <input className='cursor-pointer' type="submit" value='Save' />
          </button>
        </div>
      </div>
      <div className=' flex flex-col justify-center items-center space-y-5 mt-10'>
        <div className='text-[35px] font-bold'>
          Your Passwords
        </div>
        {passwordArray.length === 0 && <div className='font-light text-[18px] pt-10 text-[#b2b2b2]'>No Passwords To Display</div>}
        <table className="w-full lg:w-11/12 text-[17px]">
          {passwordArray.length !== 0 &&
            <thead>
              <tr className="w-full text-green-500">
                <th className="bg-neutral-900 w-[30%]  md:w-1/2 lg:rounded-l-lg mx-2 py-3">Website URL</th>
                <th className="bg-neutral-900 md:w-1/4 mx-2 py-3">Username</th>
                <th className="bg-neutral-900 md:w-2/12 mx-2 py-3">Password</th>
                <th className="bg-neutral-900 max-md:hidden md:w-full lg:rounded-r-lg mx-2 py-3">Actions</th>
              </tr>
            </thead>}
          {passwordArray.map((item, id) => {
            return <><tbody className="w-full" key={id}>
              <tr>
                <td className="p-4 px-10 md:items-center md:justify-between justify-center font-light text-green-500 underline underline-offset-2 md:space-x-2 flex">
                  <span>
                    {item.site}
                  </span>
                  <img onClick={() => { handleCopy(item.site) }} className='transition-all cursor-pointer hover:scale-110' src="src/assets/copy.svg" alt="" />
                </td>
                <td className="py-4 font-light relative max-md:text-center">
                  {item.username}
                  <img onClick={() => { handleCopy(item.username) }} className='inline transition-all cursor-pointer  hover:scale-110 md:absolute right-5' src="src/assets/copy.svg" alt="" />
                </td>
                <td type="password" className="py-4 font-light relative max-md:text-center">
                  {item.password}
                  <img onClick={() => { handleCopy(item.password) }} className='inline transition-all cursor-pointer hover:scale-110 md:absolute right-0' src="src/assets/copy.svg" alt="" />
                </td>
                <td className="py-4 font-light text-center max-md:hidden">
                  <div className='flex items-center justify-center space-x-2'>
                    <img onClick={() => handleEdit(item.id)} className='cursor-pointer hover:scale-110' src="src/assets/edit.svg" alt="" />
                    <img onClick={handleDelete} className='cursor-pointer hover:scale-110' src="src/assets/delete.svg" alt="" />
                  </div>
                </td>
              </tr>
            </tbody>
              <div className="bg-neutral-900 w-full rounded-lg py-3 flex items-center px-2 ml-10 justify-around text-green-500 font-bold md:hidden">Actions
                <div className='flex items-center justify-center space-x-2'>
                  <img onClick={() => handleEdit(item.id)} className='cursor-pointer hover:scale-110' src="src/assets/edit.svg" alt="" />
                  <img onClick={() => handleDelete(item.id)} className='cursor-pointer hover:scale-110' src="src/assets/delete.svg" alt="" />
                </div>
              </div>
            </>
          })}
        </table>
      </div>
      <div className='p-3 w-full flex justify-around items-center max-sm:flex-col bg-[#0c0c0c]'>
        <div className='text-[23px] font-bold'>
          <span className='text-green-500'>&lt;</span>Safe<span className='text-green-500'>Pass/&gt;</span>
        </div>
        <div className='flex items-center justify-center space-x-2'>
          <span className='text-center'>
            No Copyright © Prajualit Tickoo | Made With Love
          </span>
          <span className='text-red-600 text-[25px]'>♥</span>
        </div>
      </div>
    </>
  )
}

export default App
