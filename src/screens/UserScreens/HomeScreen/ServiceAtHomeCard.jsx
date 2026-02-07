import React, { memo } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const colors = {
  primary: '#156778',
  primaryLight: '#E1F5FA',
  white: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  background: '#FFFFFF',
  success: '#059669',
  border: '#E5E7EB',
  shadow: '#000',
  maleIcon: '#3B82F6',
  femaleIcon: '#EC4899',
};

const ServiceAtHomeCard = memo(({ independentPro, onPress }) => {
  const { 
    profilePhoto, 
    user, 
    address, 
    experienceYears, 
    specializations, 
    gender, 
    rating 
  } = independentPro;

  const displayAddress = address?.length > 30 
    ? `${address.substring(0, 30)}...` 
    : address || "Not available";

  const specializationText = specializations?.length 
    ? specializations.slice(0, 3).map(s => s.name).join(" • ") 
    : "Not specified";

  const genderIconColor = gender === "male" ? colors.maleIcon : colors.femaleIcon;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      activeOpacity={0.85}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${user?.name}, ${gender}, ${experienceYears} years experience, rating ${rating || 4.5}`}
      accessibilityHint="Double tap to view professional details"
    >
      <View style={styles.content}>
        {/* PROFILE IMAGE SECTION */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: profilePhoto }} 
            style={styles.profilePhoto}
            accessible={true}
            accessibilityLabel={`${user?.name}'s profile photo`}
          />
          
          {/* Rating Badge */}
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={11} color={colors.white} />
            <Text style={styles.ratingText}>{rating || 4.5}</Text>
          </View>
        </View>

        {/* DETAILS SECTION */}
        <View style={styles.detailsContainer}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {user?.name || "Professional"}
          </Text>

          {/* Location */}
          <View style={styles.detailRow}>
            <Ionicons 
              name="location" 
              size={15} 
              color={colors.textSecondary} 
            />
            <Text style={styles.detailText} numberOfLines={1}>
              {displayAddress}
            </Text>
          </View>

          {/* Experience */}
          <View style={styles.detailRow}>
            <Ionicons 
              name="briefcase" 
              size={15} 
              color={colors.textSecondary} 
            />
            <Text style={styles.detailText}>
              {experienceYears} {experienceYears === 1 ? 'year' : 'years'} experience
            </Text>
          </View>

          {/* Specializations */}
          <View style={styles.detailRow}>
            <Ionicons 
              name="cut" 
              size={15} 
              color={colors.textSecondary} 
            />
            <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">
              {specializationText}
            </Text>
          </View>

          {/* Gender */}
          <View style={styles.detailRow}>
            <Ionicons 
              name={gender === "male" ? "male" : "female"} 
              size={15} 
              color={genderIconColor}
            />
            <Text style={[styles.gender, { color: genderIconColor }]}>
              {gender}
            </Text>
          </View>
        </View>
      </View>

      {/* ACTION ARROW */}
      <View style={styles.actionArrow}>
        <Ionicons 
          name="chevron-forward" 
          size={22} 
          color={colors.primary} 
        />
      </View>
    </TouchableOpacity>
  );
});

ServiceAtHomeCard.displayName = 'ServiceAtHomeCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  imageContainer: {
    position: 'relative',
    marginRight: 14,
  },

  profilePhoto: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.border,
  },

  ratingBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  ratingText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 3,
    letterSpacing: 0.3,
  },

  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 5,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
    letterSpacing: 0.3,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
    fontWeight: '500',
  },

  gender: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
    letterSpacing: 0.5,
  },

  actionArrow: {
    marginLeft: 8,
    alignSelf: 'center',
    padding: 4,
  },
});

export default ServiceAtHomeCard;


// import React from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons'; // i  use native-vector-icons/Ionicons

// const colors = {
//     primary: '#156778',
//     primaryLight: '#E1F5FA',
//     white: '#FFFFFF',
//     textSecondary: '#6B7280',
//     background: '#FFFFFF',
//     success: '#059669', // For rating
//     border: '#E5E7EB',
// };


// const ServiceAtHomeCard = ({ independentPro, onPress }) => {
//     const { profilePhoto, user, address, experienceYears, specializations, gender, rating } = independentPro;
//     return (
//         <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
//             <View style={styles.content}>

//                 <View style={styles.imageContainer}>
//                     <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />

//                     <View style={styles.ratingBadge}>
//                         <Ionicons name="star" size={10} color={colors.white} />
//                         <Text style={styles.ratingText}>{rating || 4.5}</Text>
//                     </View>
//                 </View>

//                 <View style={styles.detailsContainer}>
//                     <Text style={styles.name}>{user?.name}</Text>

//                     <View style={styles.detailRow}>
//                         <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
//                         <Text style={styles.detailText}>{address || "Not available"}</Text>
//                     </View>

//                     <View style={styles.detailRow}>
//                         <Ionicons name="briefcase-outline" size={14} color={colors.textSecondary} />
//                         <Text style={styles.detailText}>{experienceYears} yrs Exp</Text>
//                     </View>

//                     <View style={styles.detailRow}>
//                         <Ionicons name="cut-outline" size={14} color={colors.textSecondary} />
//                         <Text style={styles.detailText} numberOfLines={1}>
//                             {specializations?.map(s => s.name).join(" | ") || "Not specified"}
//                         </Text>
//                     </View>

//                     <View style={styles.detailRow}>
//                         <Ionicons 
//                             name={gender === "male" ? "male-outline" : "female-outline"} 
//                             size={14} 
//                             color={colors.textSecondary} 
//                         />
//                         <Text style={styles.gender}>{gender}</Text>
//                     </View>
//                 </View>
//             </View>

//             <View style={styles.actionArrow}>
//                 <Ionicons name="chevron-forward" size={24} color={colors.primary} />
//             </View>
//         </TouchableOpacity>
//     );
// };

// const styles = StyleSheet.create({
//     card: {
//         flexDirection: 'row',
//         backgroundColor: colors.white,
//         borderRadius: 12,
//         marginHorizontal: 16,
//         marginBottom: 16,
//         padding: 12,
//         borderWidth: 1,
//         borderColor: colors.border,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.08,
//         shadowRadius: 3,
//         elevation: 2,
//         alignItems: 'center',
//         width: 400,
//     },
//     content: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     imageContainer: {
//         marginRight: 12,
//     },
//     profilePhoto: {
//         width: 80,
//         height: 80,
//         borderRadius: 40,
//         backgroundColor: colors.primaryLight,
//         resizeMode: 'cover',
//     },
//     ratingBadge: {
//         position: 'absolute',
//         bottom: 0,
//         right: 0,
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: colors.success,
//         borderRadius: 10,
//         paddingHorizontal: 6,
//         paddingVertical: 2,
//     },
//     ratingText: {
//         color: colors.white,
//         fontSize: 10,
//         fontWeight: 'bold',
//         marginLeft: 2,
//     },
//     detailsContainer: {
//         flex: 1,
//         justifyContent: 'center',
//     },
//     name: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: colors.primary,
//         marginBottom: 4,
//     },
//     detailRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 2,
//     },
//     detailText: {
//         fontSize: 13,
//         color: colors.textSecondary,
//         marginLeft: 6,
//         flexShrink: 1, // Allows text to wrap/truncate
//     },
//     gender: {
//         fontSize: 13,
//         color: colors.textSecondary,
//         marginLeft: 6,
//         flexShrink: 1,
//         width: '100%',
//         textTransform: 'uppercase',
//     },
//     actionArrow: {
//         marginLeft: 10,
//         alignSelf: 'center',
//     }
// });

// export default ServiceAtHomeCard;