
import useGetUserById from "@/hooks/useGetUserById";
import { FollowList } from "./FollowList";
import Modal from "./Modal"
import useFollowModal from "@/hooks/useFollowModal";


interface FollowModalProps {
    type: 'followers' | 'following';
    userId: string;
}

const FollowModal: React.FC<FollowModalProps> = ({ type, userId }) => {
    const userDetails = useGetUserById(userId);
    const FollowModal = useFollowModal();
    const { isOpen, onClose } = FollowModal;
    const onChange = () => {
        if (isOpen) {
            onClose();
        }
    };
    return(
        <Modal
            title={type === 'followers' ? 'Followers' : 'Following'}
            description={`${type === 'followers' ? userDetails?.user?.pseudo + "'s Followers" : userDetails?.user?.pseudo + "'s Following"}`}
            isOpen={FollowModal.isOpen}
            onChange={onChange}>
            <FollowList userId={userId} type={type} />
        </Modal>
    )
}