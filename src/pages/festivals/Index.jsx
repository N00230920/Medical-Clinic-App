import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {Eye, Pencil} from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";


import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toaster } from "sonner";

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

  const navigate = useNavigate();
  const location = useLocation(); 

  let message = location.state.message;

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

  const onDeleteCallback = (id) => {
    setFestivals(festivals.filter(festival=>festival.id !== id));
  };



  return (
    <>
    <Toaster/>
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
