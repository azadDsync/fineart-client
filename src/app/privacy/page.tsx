import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Introduction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to FineArt Club. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data and tell you about your privacy rights.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. Information We Collect</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-3">
            We may collect, use, store and transfer different kinds of personal data about you:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li><strong>Identity Data:</strong> Name, username, date of birth</li>
            <li><strong>Contact Data:</strong> Email address, telephone numbers</li>
            <li><strong>Profile Data:</strong> Profile picture, bio, interests, preferences</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
            <li><strong>Usage Data:</strong> Information about how you use our platform</li>
            <li><strong>Content Data:</strong> Artwork, paintings, comments, and other content you upload</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>3. How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-3">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>To register you as a new member</li>
            <li>To manage your account and provide our services</li>
            <li>To notify you about events, announcements, and updates</li>
            <li>To display your artwork and profile to other members</li>
            <li>To improve our platform and user experience</li>
            <li>To communicate with you about club activities</li>
            <li>To ensure platform security and prevent fraud</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>4. Data Sharing and Disclosure</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-3">
            We may share your personal data with:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li><strong>Other Members:</strong> Your profile, artwork, and public activities are visible to other club members</li>
            <li><strong>Service Providers:</strong> Third-party vendors who help us operate the platform (e.g., cloud hosting, email services)</li>
            <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
          </ul>
          <p className="text-muted-foreground mt-3">
            We do not sell your personal data to third parties.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>5. Data Security</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2">
            We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way.
          </p>
          <p className="text-muted-foreground">
            We use industry-standard encryption and security protocols to protect your data. However, no method of transmission over the Internet is 100% secure.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>6. Data Retention</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for. When you delete your account, we will remove your personal data, though some information may be retained for legal or administrative purposes.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>7. Your Rights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-3">
            Under data protection laws, you have the right to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li><strong>Access:</strong> Request access to your personal data</li>
            <li><strong>Correction:</strong> Request correction of inaccurate data</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Object:</strong> Object to processing of your personal data</li>
            <li><strong>Portability:</strong> Request transfer of your data to another service</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent where we rely on it</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>8. Cookies</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2">
            We use cookies and similar tracking technologies to track activity on our platform and store certain information.
          </p>
          <p className="text-muted-foreground">
            Cookies are files with a small amount of data that are sent to your browser. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>9. Third-Party Services</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-3">
            We use third-party services that may collect information about you:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li><strong>Authentication:</strong> Google OAuth for sign-in</li>
            <li><strong>Cloud Storage:</strong> Cloudinary for image hosting</li>
            <li><strong>Email:</strong> Mailgun for transactional emails</li>
            <li><strong>Analytics:</strong> For understanding platform usage (if applicable)</li>
          </ul>
          <p className="text-muted-foreground mt-3">
            These services have their own privacy policies governing the use of your information.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>10. Children's Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our platform is intended for users aged 13 and above. We do not knowingly collect personal data from children under 13. If you are a parent or guardian and believe your child has provided us with personal data, please contact us.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>11. Changes to This Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>12. Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Email: privacy@fineartclub.com</li>
            <li>Through the platform's contact form</li>
          </ul>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground mt-8 pt-8 border-t">
        <p>Last updated: October 7, 2025</p>
      </div>
    </div>
  );
}
