import React, { useState, useEffect } from 'react';
import { Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, TextField, Stepper, Step, StepLabel, Typography, Divider, Card, CardContent, CardHeader, Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PaymentIcon from '@mui/icons-material/Payment';
import { fetchUserDetailByEmail, fetchUserDetail } from 'api/userApi';
import { generatePaymentToken, processPayment } from 'api/paymentApi';
import LoadingPage from './LoadingPage';
import { reserveSlots } from 'api/bookingApi';
import { useAuth } from 'AuthContext';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const theme = createTheme({
  components: {
    MuiRadio: {
      styleOverrides: {
        root: {
          color: 'black',
          '&.Mui-checked': {
            color: 'black',
          },
        },
      },
    },
  },
});

const steps = ['Payment Details', 'Payment Confirmation'];

const PaymentDetail = () => {
  const location = useLocation();
  const { branchId, bookingRequests, totalPrice } = location.state || {  };
  const sortedBookingRequests = bookingRequests ? [...bookingRequests].sort((a, b) => {
    const dateA = new Date(`${a.slotDate}T${a.timeSlot.slotStartTime}`);
    const dateB = new Date(`${b.slotDate}T${b.timeSlot.slotStartTime}`);
    return dateA - dateB;
  }) : [];
  const [activeStep, setActiveStep] = useState(0);
  
  const [email, setEmail] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userExists, setUserExists] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded)
      setUserEmail(decoded.email)

      const fetchUserData = async (id, isGoogle) => {
        try {
          if (isGoogle) {
            const response = await axios.get(
              `https://courtcaller.azurewebsites.net/api/UserDetails/GetUserDetailByUserEmail/${id}`
            );
            setUserData(response.data);
            setUserName(response.data.fullName)
            const userResponse = await axios.get(
              `https://courtcaller.azurewebsites.net/api/Users/GetUserDetailByUserEmail/${id}?searchValue=${id}`
            );
            setUser(userResponse.data);

          } else {
            const response = await axios.get(
              `https://courtcaller.azurewebsites.net/api/UserDetails/${id}`
            );
            setUserData(response.data);
            setUserName(response.data.fullName)
            const userResponse = await axios.get(
              `https://courtcaller.azurewebsites.net/api/Users/${id}`
            );
            console.log('userResponse', userResponse.data)
            setUser(userResponse.data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      if (decoded.iss !== "https://accounts.google.com") {
        const userId = decoded.Id;
        setUserId(userId);
        fetchUserData(userId, false);
      } else {
        const userId = decoded.email;
        setUserId(userId);
        fetchUserData(userId, true);
      }
    }
  }, []);

  const handleNext = async () => {

    if (activeStep === 0) {
      setIsLoading(true); // Show loading page
      try {
        

        const bookingForm = bookingRequests.map((request) => {
          

          return {
            courtId: null, 
            branchId: branchId, 
            slotDate: request.slotDate, 
            timeSlot: {
              slotStartTime: request.timeSlot.slotStartTime, 
              slotEndTime: request.timeSlot.slotEndTime, },
          };
        });

        // Log dữ liệu gửi lên để kiểm tra
        console.log('Formatted Requests:', bookingForm);
        const booking = await reserveSlots(userData.userId, bookingForm);
        const bookingId = booking.bookingId;
        const tokenResponse = await generatePaymentToken(bookingId);
        const token = tokenResponse.token;
        const paymentResponse = await processPayment(token);
        const paymentUrl = paymentResponse;

        // Redirect to payment URL
        window.location.href = paymentUrl;
      } catch (error) {
        console.error('Error processing payment:', error);
        setErrorMessage('Error processing payment. Please try again.');
        setIsLoading(false); // Hide loading page if there's an error
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };



  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Box sx={{ backgroundColor: "#E0E0E0", padding: '20px', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom color="black">
                Customer Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <strong>{userName}</strong>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {userEmail}
              </Box>
            </Box>


            {/* box này là thông tin payment method */}
            <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Grid container spacing={2} >
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: "#E0E0E0",
              padding: '20px',
              borderRadius: 2,
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            <Typography variant="h5" gutterBottom color="black" display="flex" alignItems="center">
              <PaymentIcon sx={{ marginRight: '8px' }} /> Payment Method
            </Typography>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ color: 'black' }}>Select Payment Method</FormLabel>
              <RadioGroup aria-label="payment method" name="paymentMethod">
                <FormControlLabel value="creditCard" control={<Radio />} label="Credit Card" sx={{ color: 'black' }} />
              </RadioGroup>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ backgroundColor: "#E0E0E0", padding: '20px', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom color="black">
              Bill
            </Typography>
            <Typography variant="h6" color="black">
              <strong>Branch ID:</strong> {branchId}
            </Typography>
            <Typography variant="h6" color="black" sx={{ marginTop: '20px' }}>
              <strong>Time Slot:</strong>
            </Typography>
            {bookingRequests && sortedBookingRequests.map((request, index) => (
              <Box key={index} sx={{ marginBottom: '15px', padding: '10px', backgroundColor: '#FFFFFF', borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="body1" color="black">
                  <strong>Date:</strong> {request.slotDate}
                </Typography>
                <Typography variant="body1" color="black">
                  <strong>Start Time:</strong> {request.timeSlot.slotStartTime}
                </Typography>
                <Typography variant="body1" color="black">
                  <strong>End Time:</strong> {request.timeSlot.slotEndTime}
                </Typography>
                <Typography variant="body1" color="black">
                  <strong>Price:</strong> {request.price} USD
                </Typography>
              </Box>
            ))}
            <Divider sx={{ marginY: '10px' }} />
            <Typography variant="h6" color="black">
              <strong>Total Price:</strong> {totalPrice} USD
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
            
          </>
        );
      case 1:
        return <LoadingPage />; // Show loading page

        // -----------------------------------------------------------------------------------
        {/* xử lý vnPay xong thì đưa ra cái này !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
         // đổi case 1 thành paymentconfimationstep hoặc paymentrejectedstep dựa trên kết quả trả về từ vnpay
      case 1:
        //thành công
        // return <PaymentConfirmationStep userInfo={userInfo} branchId={branchId} timeSlot={timeSlot} totalPrice={totalPrice} />;

        //thất bại
        return <PaymentRejectedStep />;
        */}
      // -----------------------------------------------------------------------------------

      default:
        return 'Unknown step';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box m="20px" p="20px" sx={{ backgroundColor: "#F5F5F5", borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom color="black">
          Payment Details
        </Typography>
        <Stepper activeStep={activeStep} sx={{ marginBottom: '20px' }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {isLoading ? <LoadingPage /> : getStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ marginRight: '20px' }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={isLoading} // Disable button while loading
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default PaymentDetail;


