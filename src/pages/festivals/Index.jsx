import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

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

  // const festivalCards = festivals.map((festival) => {
  //   return (
  //     <Card key={festival.id}>
  //       <CardHeader>
  //         <CardTitle>{festival.title}</CardTitle>
  //         <CardDescription>{festival.description}</CardDescription>
  //         {/* <CardAction>Card Action</CardAction> */}
  //       </CardHeader>
  //       {/* <CardContent>
  //         <p>Card Content</p>
  //       </CardContent> */}
  //       <CardFooter>
  //         <Button
  //           asChild
  //           variant='outline'
  //         ><Link size='md' to={`/festivals/${festival.id}`}>View</Link></Button>
  //       </CardFooter>
  //     </Card>
  //   );
  // });

  return (
    <>
      <Button
        asChild
        variant='outline'
        className='mb-4 mr-auto block'
      ><Link size='sm' to={`/festivals/create`}>Create New Festival</Link>
      </Button>


    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {festivals.map((festival) => (
          <TableRow key={festival.id}>
            <TableCell>{festival.title}</TableCell>
            <TableCell>{festival.city}</TableCell>
            <TableCell>{festival.start_date}</TableCell>
            <TableCell>{festival.end_date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
  );
}
