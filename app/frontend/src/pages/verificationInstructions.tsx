/*Just a page created to direct the user to in case they try to sign in
without clicking the verification email.
Still needs to be styled and equiped with a logout button.
*/
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { sendEmailVerification } from 'firebase/auth';

const VerificationInstructions: React.FC = () => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState<string>('');

  const resendVerificationEmail = async () => {
    if (currentUser) {
      try {
        await sendEmailVerification(currentUser);
        setMessage('Verification email sent successfully. Please check your inbox.');
      } catch (error: any) {
        console.error('Error sending verification email:', error);
        setMessage(error.message || 'An error occurred while sending the verification email.');
      }
    }
  };

  return (
    <div>
      <h1>Verify Your Email Address</h1>
      <p>To access this page, please verify your email address.</p>
      <p>We have sent a verification email to your registered email address. Please check your inbox and follow the instructions to verify your email.</p>
      <p>If you haven't received the verification email, click the button below to resend it.</p>
      <button onClick={resendVerificationEmail}>Resend Verification Email</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerificationInstructions;