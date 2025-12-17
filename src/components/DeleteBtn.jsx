import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import axios from "@/config/api";
import { useState } from "react";

export default function DeleteBtn({ resource, id, onDeleteCallback, cascade = [] }) {
    const [isDeleting, setIsDeleting] = useState(false);

    let token = localStorage.getItem('token');

    const deleteCascade = async () => {
        if (!cascade.length) return;

        for (const item of cascade) {
            if (!item?.resource || !item?.matchField) continue;
            const listResponse = await axios.request({
                method: "GET",
                url: `/${item.resource}`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const related = (listResponse.data || []).filter(
                (entry) => String(entry[item.matchField]) === String(id)
            );
            if (!related.length) continue;
            await Promise.all(
                related.map((entry) =>
                    axios.request({
                        method: "DELETE",
                        url: `/${item.resource}/${entry.id}`,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                )
            );
        }
    };

    const onDelete = async () => {
        const options = {
            method: "DELETE",
            url: `/${resource}/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
      };

      try {
        await deleteCascade();
        let response = await axios.request(options);
        console.log(response.data);
        if (onDeleteCallback) {
            onDeleteCallback(id);
        }
        setIsDeleting(false);
      } catch (err) {
        console.log(err);
      }
    };

  return (
    (!isDeleting) ?(
        <Button 
            className="cursor-pointer text-red-500 hover:border-red-700 hover:text-red-700"
            variant="outline"
            size="icon"
            onClick={() => setIsDeleting(true)}
        ><Trash /></Button>
    ) : (
        <>
            <p>Are you sure?</p>
            <Button 
                onClick={onDelete}
                variant="outline"
                size="sm"
                className="cursor-pointer text-red-500 border-red-500 hover:text-red-700 hover:border-red-700"
            >Yes</Button>
            <Button 
                onClick={() => setIsDeleting(false)}
                variant="outline"
                size="sm"
                className="cursor-pointer text-slate-500 border-slate-500 hover:text-slate-700 hover:border-slate-700"
            >No</Button>
        </>
    )
   
  );
}
