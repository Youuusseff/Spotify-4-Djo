import useGetUserById from "@/hooks/useGetUserById";
import { FollowList } from "./FollowList";
import Modal from "./Modal"
import useFollowModal from "@/hooks/useFollowModal";

interface FollowersModalProps {
    userId: string;
}

const FollowersModal = ({ userId }: FollowersModalProps) => {
    console.log('FollowersModal userId:', userId);
    const FollowModal = useFollowModal();
    const { isOpen, onClose } = FollowModal;
    const userDetails = useGetUserById(userId);
    console.log('FollowersModal userDetails:', userDetails);
    const onChange = () => {
        if (isOpen) {
            onClose();
        }
    };
    return(
        <Modal
            title={'Followers List'}
            description={`Followers of ${userDetails?.user?.pseudo}`}
            isOpen={FollowModal.isOpen}
            onChange={onChange}
            className="h-auto w-[85vw] max-h-[85vh]">
            <FollowList userId={userId} type='followers'/>
        </Modal>
    )
}

export default FollowersModal;