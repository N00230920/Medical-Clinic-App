import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from '@/components/ui/button'

export default function Index() {
  const [festivals, setFestivals] = useState([]);

  useEffect(() => {
    const fetchFestivals = async () => {
      const options = {
        method: "GET",
        url: "https://festivals-api.vercel.app/festivals",
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setFestivals(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFestivals();
  }, []);

  const festivalCards = festivals.map((festival) => {
    return (
      <Card key={festival.id}>  
        <CardHeader>
          <CardTitle>{festival.title}</CardTitle>
          <CardDescription>{festival.description}</CardDescription>
          {/* <CardAction>Card Action</CardAction> */}
        </CardHeader>
        {/* <CardContent>
          <p>Card Content</p>
        </CardContent> */}
        <CardFooter>
          <Button
            asChild
            variant='outline'
          ><Link size='md' to={`/festivals/${festival.id}`}>View</Link></Button>
        </CardFooter>
      </Card>
    );
  });

  return (
    <>
      <h1>Festivals page</h1>
      {festivalCards}
    </>
  );
}
