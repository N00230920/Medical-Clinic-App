import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router';
import { useAuth } from "@/hooks/useAuth";

export default function Show() {
  const [festival, setFestival] = useState([]);
  const { id } = useParams();

  const {token} = useAuth();

  useEffect(() => {
    const fetchFestival = async () => {
      const options = {
        method: "GET",
        url: `https://festivals-api.vercel.app/festivals/${id}`,
        headers: {
            Authorization: `Bearer ${token}`
        }
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setFestival(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFestival();
  }, []);

  return <>Show festival</>;
}
