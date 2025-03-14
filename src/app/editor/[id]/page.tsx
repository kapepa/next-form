import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NextPage } from "next";
import { FormEditor } from "../component/form-editor";
import { redirect } from "next/navigation";
import { Routers } from "@/types/routers";
import { UserDtoType } from "../../../../dto/user.dto";
import { useProfileMyselfServer } from "@/hooks/use-profile-myself-server";

interface EditorIdPageProps {
  params: {
    id: string;
  };
}

const EditorIdPage: NextPage<EditorIdPageProps> = async (props) => {
  const { params: { id } } = props;
  const { profile } = await useProfileMyselfServer();



  // console.log("id", id)
  console.log("profile", props)


  return (
    <div
      className="flex justify-center items-center grow"
    >
      <Card
        className="w-full max-w-6xl"
      >
        <CardHeader>
          <CardTitle
            className="text-center pb-2 text-xl"
          >
            Editor
          </CardTitle>
          <CardDescription
            className="text-center text-sm"
          >
            Create your own post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormEditor />
        </CardContent>
      </Card>
    </div>
  )
}

export default EditorIdPage;