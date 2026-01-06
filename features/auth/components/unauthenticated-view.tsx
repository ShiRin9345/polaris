import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { SignInButton } from "@clerk/nextjs";
import { ShieldAlertIcon } from "lucide-react";

export default function UnauthenticatedView() {
  return (
    <div className="flex-center h-screen bg-background ">
      <div className="w-full max-w-lg bg-muted">
        <Item variant="outline">
          <ItemMedia variant="icon">
            <ShieldAlertIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Unauthorized Access</ItemTitle>
            <ItemDescription>
              You do not have permission to access this page.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <SignInButton>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </SignInButton>
          </ItemActions>
        </Item>
      </div>
    </div>
  );
}
