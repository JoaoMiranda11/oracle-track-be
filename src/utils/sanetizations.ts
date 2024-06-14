interface phoneInputs {
  phone: string;
}

export function testValidPhoneNumber(phone: string) {
  const digits = phone.replace(/\D/g, '');

  if (new Set(digits).size === 1) {
      return false;
  }

  const phoneRegex =
    /^\+55(11|12|13|14|15|16|17|18|19|21|22|24|27|28|31|32|33|34|35|37|38|41|42|43|44|45|46|47|48|49|51|53|54|55|61|62|63|64|65|66|67|68|69|71|73|74|75|77|79|81|82|83|84|85|86|87|88|89|91|92|93|94|95|96|97|98|99)\d{9}$/;
  return phoneRegex.test(phone);
}


export function cleanupPhoneNumber(phones: phoneInputs[] = []) {
  const invalidPhoneUsers: any[] = [];
  const validPhones = phones.filter((userInfo) => {
    if (!userInfo.phone || typeof userInfo.phone !== 'string') {
      invalidPhoneUsers.push(userInfo);
      return false;
    }
    if (userInfo.phone.length < 10) {
      invalidPhoneUsers.push(userInfo);
      return false;
    }
    if (!userInfo.phone.startsWith('+')) {
      userInfo.phone = `+55${userInfo.phone}`;
    }
    if (userInfo.phone.length === 13) {
      const first = (userInfo.phone as string).substring(0, 5);
      const last = (userInfo.phone as string).substring(5);
      userInfo.phone = `${first}9${last}`;
    }
    if (userInfo.phone.length === 15) {
      ('+5502999994243');
      userInfo.phone = (userInfo.phone as string).replaceAll('+550', '+55');
    }
    if (testValidPhoneNumber(userInfo.phone)) {
      return true;
    } else {
      invalidPhoneUsers.push(userInfo);
      return false;
    }
  });
  return {
    valid: validPhones,
    invalid: invalidPhoneUsers,
  };
}
