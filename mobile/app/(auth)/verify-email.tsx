import { authStyles } from "@/assets/styles/auth.styles";
import { COLORS } from "@/constants/colors";
import { useSignUp } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import React from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

type VerifyEmailScreenProps = {
  emailAddress?: string;
  onBack: () => void;
};

const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({
  emailAddress,
  onBack,
}) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleVerification = async () => {
    // Check if the sign-up process is loaded from Clerk
    if (!isLoaded) return;

    // Set loading state to true while we attempt verification
    setLoading(true);

    // Attempt to verify the email address with the provided code
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === "complete") {
        // If verification is successful, set the user as active
        await setActive({ session: signUpAttempt.createdSessionId });
        // Optionally, navigate to the main app screen or dashboard here
      } else {
        Alert.alert("Error", "Verification failed. Please try again.");
        console.error("Verification not complete:", signUpAttempt);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during verification.");
      // JSON.stringify(error, null, 2): This will format the error object as a JSON string with indentation for easier reading.
      console.error("Verification failed:", JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 68 : 74}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../../assets/images/i3.png")}
            style={authStyles.image}
            contentFit="contain"
          />

          <Text style={authStyles.title}>Verify Account</Text>
          <Text style={authStyles.subtitle}>
            {`A verification code has been sent to\n${emailAddress}`}
          </Text>

          {/* FORM CONTAINER */}
          <View style={authStyles.formContainer}>
            {/* Verification Code Input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter verification code..."
                placeholderTextColor={COLORS.textLight}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </View>

            {/* Submit Input */}
            <TouchableOpacity
              style={[
                authStyles.authButton,
                loading && authStyles.buttonDisabled,
              ]}
              onPress={handleVerification}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Verifying..." : "Verify email"}
              </Text>
            </TouchableOpacity>

            {/* Back Button */}
            <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
              <Text style={authStyles.linkText}>
                <Text style={authStyles.link}>Back to Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyEmailScreen;
