import React, {useEffect, useState} from 'react'
import axios from 'axios'
import './Client.css'

const Client = ({user}) => {
  const [balance, setBalance] = useState([])

  useEffect(() => {
    const fetchUserBalance = async () => {
      const res = await axios.get(`/api/schedule/payment/user/balance/${user._id}`);
      setBalance(res.data);
    };
    fetchUserBalance();
  }, []);


  return (
    <div>{user.name}</div>
  )
}

export default Client