import useGetUserById from "@/hooks/useGetUserById";
import { FollowList } from "./FollowList";
import Modal from "./Modal"
import useFollowModal from "@/hooks/useFollowModal";
import useFollowingModal from "@/hooks/useFollowingModal";

interface FollowingModalProps {
    userId: string;
}

const FollowingsModal = ({ userId }: FollowingModalProps) => {
    console.log('FollowingsModal userId:', userId);
    const FollowModal = useFollowingModal();
    const { isOpen, onClose } = FollowModal;
    const userDetails = useGetUserById(userId);
    console.log('FollowingsModal userDetails:', userDetails);
    const onChange = () => {
        if (isOpen) {
            onClose();
        }
    };
    return(
        <Modal
            title={'Followings List'}
            description={`Followings of ${userDetails?.user?.pseudo}`}
            isOpen={FollowModal.isOpen}
            onChange={onChange}
            className="h-min-[500px] h-auto max-h-[85vh]">
            <FollowList userId={userId} type='following'/>
        </Modal>
    )
}

export default FollowingsModal;