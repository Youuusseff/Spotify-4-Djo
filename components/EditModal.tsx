import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Input from "./Input"
import Modal from "./Modal"
import { useEffect, useState } from "react";
import Button from "./Button";
import { useUser } from "@/hooks/useUser";
import useEditModal from "@/hooks/useEditModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const EditModal = () => {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const {user, userDetails, setUserDetails} = useUser();
    const editModal = useEditModal();
    const supabaseClient = useSupabaseClient();

    const { 
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            username: '',
            bio: '',
        }
    });

    useEffect(() => {
        if (userDetails) {
            reset({
                username: userDetails.pseudo || "",
                bio: userDetails.bio || "",
            });
        }
    }, [userDetails, reset]);

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            editModal.onClose();
        }
    };

    const onSubmit: SubmitHandler<FieldValues> = async(values) => {
        try{
            setIsLoading(true);
            if (!user) {
                return;
            }
           

            const { error } = await supabaseClient
                .from('users')
                .update({
                    pseudo: values.username,
                    bio: values.bio
                })
                .eq('id', user.id)
            
            if (error) {
                toast.error("Failed to update profile");
                console.error(error);
                setIsLoading(false);
                return;
            }

            router.refresh();
            setIsLoading(false);
            toast.success("Profile updated successfully");
            setUserDetails({
                ...userDetails!,
                pseudo: values.username,
                bio: values.bio,
            });
            reset();
            editModal.onClose();

        }catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An error occurred while updating your profile.");
        }
        finally {
            setIsLoading(false);
        }
    }



    return (
        <Modal
            title="Edit Profile"
            description="Update your profile details"
            isOpen={editModal.isOpen}
            onChange={onChange}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <Input placeholder="Username" id="pseudo" disabled={isLoading} {...register("pseudo")} />
                <Input placeholder="bio" id="bio" disabled={isLoading} {...register("bio")} />
                    <Button disabled={isLoading} type="submit">Save Changes</Button>
                </form>
        </Modal>
    )
}

export default EditModal;