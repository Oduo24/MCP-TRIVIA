import React, { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import useFetch from '../../../hooks/useFetch';
import { Success } from '../../../models';
import toast from 'react-hot-toast';

const Account = () => {
    const { username, setUsername } = useAuth();
    const [ user, setUser ] = useState('');
    const { fetchData, loading } = useFetch();

    const handleUsernameChange = async(e: React.FormEvent) => {
        e.preventDefault();

        const usernameChangeEndpoint = "/api/change_username";
        try {
            const usernameChange: Success = await fetchData({
                method: 'POST',
                endpoint: usernameChangeEndpoint,
                body: {user}
            })
            if (usernameChange.status === 'Success') {
                handleUsernameChangeSuccess();
            } else if (usernameChange.status === 'taken') {
                handleUsernameAlreadyTaken();
            }
        } catch (error) {
            handleusernameChangeError(error as Error);
        }
    }

    const handleUsernameChangeSuccess = () => {
        setUsername(user);
        setUser("");
        const notify = () => toast.success('Username changed suucessfuly!');
        notify();
    }

    const handleUsernameAlreadyTaken = () => {
        const notify = () => toast.error('Sorry, username already taken!');
        notify();
    }

    const handleusernameChangeError = (error: Error) => {
        const notify = () => toast.error(`${error}`);
        notify();
    }


  return (
    <div className="row flex-fill justify-content-center text-center">
         <div className="col-md-8 text-center">
            <h1 className="my-2 page-title">Account</h1>
            <p className='title-text'>Update your Account details here</p>
            <div className="row justify-content-center text-center">
                <div className="col-md-8 text-center">
                <form onSubmit={handleUsernameChange}>
                <div className="form-group text-white mb-3">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        className="form-control login-input"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        id="username"
                        placeholder={username}
                        required
                    />
                </div>
                
                <div className="text-center">
                  <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                    {loading ? "Updating..." : "Update"}
                  </button>
                </div>
            </form>
                </div>
            </div>

         
         </div>
    </div>
     
  )
}

export default Account