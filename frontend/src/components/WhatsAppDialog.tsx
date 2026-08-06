import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type WhatsAppDialogProps = {
  children: React.ReactNode;
};

const communityUrl = (import.meta.env.VITE_WHATSAPP_COMMUNITY_URL ?? "").trim();
const hasInviteLink = communityUrl.startsWith("https://chat.whatsapp.com/");

const WhatsAppDialog = ({ children }: WhatsAppDialogProps) => (
  <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent className="sm:max-w-[420px] text-center">
      <DialogHeader className="items-center">
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/10">
          <MessageCircle className="h-8 w-8 text-[#25D366]" />
        </div>
        <DialogTitle className="font-heading text-2xl text-primary">StartupA2Z WhatsApp</DialogTitle>
        <DialogDescription className="text-center">
          Join our WhatsApp community for event announcements, founder conversations, and important updates.
        </DialogDescription>
      </DialogHeader>
      {hasInviteLink ? (
        <Button asChild className="mt-2 h-12 rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a]">
          <a href={communityUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-5 w-5" /> Open WhatsApp
          </a>
        </Button>
      ) : (
        <div className="mt-2 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
          The WhatsApp invite link will be available shortly.
        </div>
      )}
    </DialogContent>
  </Dialog>
);

export default WhatsAppDialog;
