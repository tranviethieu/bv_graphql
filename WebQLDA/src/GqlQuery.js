import gql from 'graphql-tag';

export const ME=gql`
{
  response:me{
    code
    message
    data{
      _id
      fullName
      phoneNumber
      address
      birthday
      createdTime
      isRoot
      department{
        name
        _id
      }
      email
      work
      userName
      title
      roles{
        _id
        projectId
        role
        project{
          name
        }
      }
    }
  }
}
`
export const UPDATE_TICKET=gql`
mutation($_id:String,$status:String,$note:String){
  response:updateTicketStatus(_id:$_id,status:$status,note:$note){
    code
    message
  }
}
`
export const ALL_SLUG_BY_TYPE=gql`
query($type:String!){
    response:slugs(filtered:[{id:"type",value:$type}]){
        code
        message
        data{
            _id
            value
        }
    }
}
`

export const QUERY_TRANSACTIONS=gql`
query($page:Int,$pageSize:Int,$sorted:[SortedInput],$filtered:[FilteredInput]){
  response:transactions(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered){
    code
    message
    page
    pages
    data{
  		_id
      amount
      createdTime
      direction
      modifier{
        modifierName
        type
        modifierId
        action
      }
      itemId
      itemType
      method
      provider
      note
      type
      transactionByProviderId
    }
  }
}
`

export const QUERY_REPORT_TRANSFER_REQUEST_AMOUNT=gql`
query($from:DateTime,$to:DateTime,$type:String,$status:String){
  response:reportTransferRequestAmount(from:$from,to:$to,type:$type,status:$status)
	{
    code
    message
    data{
      name
      value
    }
  }
}
`

export const QUERY_REPORT_TRANSFER_REQUEST_NUMB=gql`
query($from:DateTime,$to:DateTime,$type:String){
  response:reportTransferRequestNumb(from:$from,to:$to,type:$type){
    code
    message
    data{
      name
      value
    }
  }
}

`
export const UPDATE_TRANSFER_REQUEST=gql`
mutation($_id:String!,$status:Int){
  response:updateTransferRequest(_id:$_id,status:$status){
    code
    message
    data
  }
}
`;
export const QUERY_TRANSFER_REQUEST=gql`
query($_id:String!){
  response:transferRequest(_id:$_id){
    code
    message
    data{
      _id
      amount
      type
      status
      createdTime
      reason      
      itemId
      itemType
      modifier{
        modifierName
        modifierId
        type
        time
        note
      }
      sender{
        modifierId
        modifierName
        type
        time
        note
      }
    }
  }
}
`

export const QUERY_TRANSFER_REQUESTS=gql`
query($page:Int,$pageSize:Int,$sorted:[SortedInput],$filtered:[FilteredInput]){
  response:transferRequests(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered){
    code
    message
    pages
    page
    data{
      _id
      amount
      type
      status
      createdTime
      reason      
      itemId
      itemType
      modifier{
        modifierName
        modifierId
        type
        time
        note
      }
      sender{
        modifierId
        modifierName
        type
        time
        note
      }
    }
  }
}

`

export const QUERY_PROFIT_BY_CHANNEL=gql`
query ($startDate:DateTime,$endDate:DateTime,$serviceId:String){
  response:profitByChannel(startDate:$startDate,endDate:$endDate,serviceId:$serviceId){
    code
    message
    data{
      name
      value
    }
  }
}
`

export const CREATE_ORDER=gql`
mutation($order:OrderInput,$user:UserInput){
  response:createOrder(order:$order,user:$user){
    code
    message
  }
}
`

export const MATCH_WORKTASK=gql`
mutation($_id:String!,$accountId:String){
  response:matchWorkTask(_id:$_id,accountId:$accountId){
    code
    message
    data
  }
}
`
export const UNMATCH_WORKTASK=gql`
mutation($_id:String!,$reason:String){
  response:unMatchWorkTask(_id:$_id,reason:$reason){
    code
    message
    data
  }
}
`

export const QUERY_MATCHING_ORDER_PROFILE=gql`
query($orderId:String!){
  response:matchingServiceProfile(orderId:$orderId){
    code
    message
    data{
      _id
      name
      geo
      address
      locationId
      account{
        name
        _id
        info{
          fullName
          image
          phoneNumber
        }
      }
      workTimes{
        dayOfWeek
        startTime
        endTime
      }
      serviceGroups{
        _id
        name
      }
    }
  }
}

`

export const UPDATE_SERVICE_PROFILE=gql`
mutation UpdateServiceProfile($serviceProfile:ServiceProfileInput!){
  response:updateServiceProfile(serviceProfile:$serviceProfile){
    code
    message
    data{
      _id
    }
  }
}
`

export const CHECK_VOUCHER=gql`
mutation($serviceId:String,$code:String){
  response:checkVoucher(serviceId:$serviceId,code:$code){
    code
    message
    data
  }
}
`

export const QUERY_SERVICE_REPORT=gql`
query ServiceReport($startDate:DateTime,$endDate:DateTime,$_id:String){
  response:serviceReports(startDate:$startDate,endDate:$endDate,_id:$_id){
    code
    message
    data{
      service{
        _id
        name
        thumbImage
        price
        shareUnitPrice
        tasks
        duration
      }
      totalUser
      totalCancel
      totalPending
      totalConfirm
      totalFinish
    }
  }
}
`

export const QUERY_GENERAL_PROFIT=gql`
query profits($rangeBy:String!,$serviceId:String,$start:Int,$end:Int,$year:Int,$startDate:DateTime,$endDate:DateTime){
  response:profits(rangeBy:$rangeBy,serviceId:$serviceId,start:$start,end:$end,year:$year,startDate:$startDate,endDate:$endDate){
    code
    message
    data{
      label
      amountConfirm
      amountPending
      shareConfirm
      sharePending
    }
  }
}
`
export const SEND_NOTIFY=gql`
mutation sendNotify($notifyMessage:InboxInput){
  response:sendNotify(notifyMessage:$notifyMessage){
    code
    message    
  }
}
`

export const QUERY_COUNT_DEVICE=gql`
query countDevice($appId:String!){
  response:countDevice(appId:$appId){
    code
    message
    data
  }
}
`

export const QUERY_NOTIFY_MESSAGE=gql`
query notifyMessage($_id:String!){
  response:notifyMessage(_id:$_id){
    code
    message
    pages
    data{
      receiver{
        objectType
        _id
      }
      _id
      title
      shortDesc
      content
      badge
      sound
      source
      phoneNumber
      image
      receivedTime
      option{
        type
        linked
      }
    }
  }
}
`

export const QUERY_NOTIFY_MESSAGES=gql`
query notifyMessages($page:Int,$pageSize:Int,$sorted:[SortedInput],$filtered:[FilteredInput]){
  response:notifyMessages(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered){
    code
    message
    pages
    data{
      receiver{
        objectType
        _id
      }
      _id
      title
      shortDesc
      content
      badge
      sound
      source
      phoneNumber
      image
      receivedTime
      option{
        type
        linked
      }
    }
  }
}
`

export const QUERY_EXPIRED_WORKTASKS=gql`
query($accountId:String){
  response:expiredWorkTasks(accountId:$accountId){
    code
    message
    data{
      _id
      status
      startTime
      endTime
      userId
      accountId
      date
      account{
        _id
        geo
        info{
          fullName
          phoneNumber
          image
        }
      }
      order{
        _id
        name
        phoneNumber
        address
        wards
        district
        province
        note
        geo
        user{
          avatar
          _id
          fullName
          phoneNumber
        }
      	service{
          _id
          name
        }
      }
      
    }
  }
}
`

export const UPLOAD_MUTATION= gql`
  mutation Upload($folder:String,$file:FileUploadInputType){
    uploadImage(folder:$folder,file:$file)
  }
`;

export const QUERY_TICKETS=gql`
query Tickets($page:Int,$pageSize:Int,$sorted:[SortedInput],$filtered:[FilteredInput]){
  response:tickets(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered){
    code
    message
    pages
    records
    data{
      _id
      note
      createdTime
      updatedTime
      history{
        modifierId
        modifierName
        action
        note
      }    
      status
      type
      order{
        _id
        name
        phoneNumber
        address
        geo
        service{
          name
          _id
        }
      }
      user{
        fullName
        phoneNumber
        avatar
      }
      account{
      	info{
          image
          fullName
          phoneNumber
        }
      }
    }
  }
}
`

export const CREATE_MULTY_VOUCHER=gql`
mutation CreateMultyVoucher($voucher:VoucherInput,$number:Int){
  response:createMultyVoucher(voucher:$voucher,number:$number){
    code
    message
  }
}
`

export const QUERY_VOUCHER=gql`
query Voucher($_id:String!){
  response:voucher(_id:$_id){
    code
    message
    data{
      _id
      thumbImage
      coverImage
      name
      promotionCode
      updatedTime
      phoneNumber
      createdTime
      history{
        modifierName
        modifierId
        time
        action
      }
      description
      state
      discountType
      discountValue
      maxQuota
      maxDiscount
      startDate
      endDate
      service{
        name
        _id
      }
    }
  }
}
`

export const QUERY_VOUCHERS=gql`
query Vouchers($page:Int,$pageSize:Int,$sorted:[SortedInput],$filtered:[FilteredInput]){
  response:vouchers(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered){
    code
    message
    pages
    data{
      _id
      thumbImage
      coverImage
      name
      promotionCode
      updatedTime
      phoneNumber
      createdTime
      history{
        modifierName
        modifierId
        time
        action
      }
      description
      state
      discountType
      discountValue
      maxQuota
      maxDiscount
      startDate
      endDate
      service{
        name
        _id
      }
    }
  }
}
`

export const QUERY_WORKTASKS=gql`
query WorkTasks($page:Int,$pageSize:Int,$sorted:[SortedInput],$filtered:[FilteredInput]){
	response:workTasks(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered){
    code
    message
    pages
    data{
      _id
      status
      order{
        name
        address
        phoneNumber
        geo
        service{
          name
        }
      }
      account{
        userName
        info{
          phoneNumber
          fullName
        }
      }
      category
      createdTime
      date
      startTime
      endTime
      note
    }
  }
}
`

export const QUERY_USER=gql`
query User($_id:String,$phoneNumber:String){
  user(_id:$_id,phoneNumber:$phoneNumber){
    code
    message
    data{
      _id
      address
      fullName
      phoneNumber
      avatar
      birthDay
      gender
      patientId
      createdTime
      lastUpdate
      email
      mariage
      contacts{
        fullName
        address
        birthDay
        phoneNumber
        group
        mariage
      }
      defaultLocation{
        name
        phoneNumber
        geo
        address
      }
    }
  }
}
`
export const QUERY_USERS=gql`
query Users($page:Int,$pageSize:Int,$sorted:[SortedInput],$filtered:[FilteredInput]){
  response:users(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered){
    code
    message
    data{
      _id
      address
      fullName
      phoneNumber
      avatar
      birthDay
      gender
      patientId
      createdTime
      lastUpdate
      email
      defaultLocation{
        name
        phoneNumber
        geo
        address
      }
    }
  }
}
`

export const QUERY_SERVICE_USERS=gql`
query serviceUsers($page:Int,$pageSize:Int,$sorted:[SortedInput],$filtered:[FilteredInput]){
  response:serviceUsers(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered){
    code
    message
    pages
    records
    page
    data{
      _id
      address
      fullName
      phoneNumber
      avatar
      birthDay
      gender
      patientId
      createdTime
      lastUpdate
      email
      defaultLocation{
        name
        phoneNumber
        geo
        address
      }
    }
  }
}
`
export const QUERY_ORDER=gql`
query order($_id:String!){
  response:order(_id:$_id){
    code
    message
    data{
      _id
      phoneNumber
      address
      geo
      updatedTime
      status
      payAmount
      paymentMethod      
      user{
        name
        avatar
        phoneNumber
      }
      address
      taskIds
      workTimes
      geo
      name
      serviceId
      service{
        name
        price
        tasks
        _id
      }
      tasks{
        _id
        startTime
          status
          account{
          name
          info{
            fullName
            phoneNumber
            image
          }
        }
         rating{
           value
           note
         }
       }
      note
    }
  }
}
`
export const QUERY_EMPLOYEE_ORDERS=gql`
query($page:Int,$pageSize:Int,$sorted:[SortedInput],$filtered:[FilteredInput],$accountId:String!){
  response:employeeOrders(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered,accountId:$accountId){
    code
    message
    page
    records
    pages
    data{
      _id
      name
      address
      geo
      phoneNumber
      status
      createdTime
      updatedTime
      paid
      payAmount
      paymentMethod
      tasks{
        accountId
        status
        date
      }
      user{
        name
        avatar
        phoneNumber
      }
      service{
        name
        _id
      }
    }
  }
}
`;
export const QUERY_ORDERS=gql`
query Orders($page:Int,$pageSize:Int,$sorted:[SortedInput],$filtered:[FilteredInput]){
  response:orders(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered){
    code
    message
    page
    pages
    data{
      _id
      phoneNumber
      address
      district
      province
      wards
      geo
      paid
      updatedTime
      status
      payAmount
      paymentMethod      
      user{
        name
        avatar
        phoneNumber
      }
      address
      taskIds
      tasks{
        startTime
        status
      }
      name
      service{
        name
        _id
        groupId
        group{
          name
        }
      }
      note
    }
  }
}
`

export const DELETE_SERVICEPROFILE=gql`
mutation DeleteServiceProfile($_id:String!){
  response:deleteServiceProfile(_id:$_id){
    code
    message
  }
}
`

export const QUERY_SERVICEPROFILE = gql`
query ServiceProfile($_id:String!){
  response:serviceProfile(_id:$_id){
    code
    message
    data{
      _id
      locations{
        address
        geo
      }
      serviceGroups{
        _id
        name        
      }
      ballance
      rateNumb
      createdTime
      rating
      accountId
      serviceGroupIds
      account{
        _id
        name
        userName
        info{
          image
          fullName
          phoneNumber
          email
        }
        
      }     
      workTimes{
        dayOfWeek
        endTime
        startTime        
      }
    }
  }
}
`
export const QUERY_SERVICEPROFILES =gql`
query ServiceProfiles($page:Int,$pageSize:Int,$sorted:[SortedInput],$filtered:[FilteredInput]){
  response:serviceProfiles(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered){
    code
    message
    pages
    records
    page
    data{
      _id
      ballance
      rateNumb
      createdTime
      rating      
      locations{
        address
        geo
      }
      name
      accountId
      account{
        _id
        name
        userName
        info{
          phoneNumber
          image
        }
      }
      serviceGroups{
        name
        _id
      }
      workTimes{
        dayOfWeek
        endTime
        startTime        
      }
    }
  }
}
`

export const UPDATE_SERVICE=gql`
mutation UpdateService($service:ServiceInput){
  response:updateService(service:$service){
    code
    message
  }
}
`

export const DELETE_SERVICE=gql`
mutation DeleteService($_id:String!){
  response:deleteService(_id:$_id){
    code
    message
  }
}
`
export const QUERY_SERVICE = gql`
query service($_id:String!){
  response:service(_id:$_id){
    code
    message
    data{
      name
      _id
      price
      shareUnitPrice
      description
      coverImage
      thumbImage
      slug
      tasks
      createdTime
      updatedTime
      duration
      active
      content
      groupId
      group{
        _id
        name
      }
    }
  }
}
`
export const QUERY_SERVICES=gql`
query Services{
  response:services{
    code
    message
    data{
      name
      _id
      price
      shareUnitPrice
      description
      coverImage
      thumbImage
      slug
      tasks
      createdTime
      updatedTime
      duration
      groupId
      active
      group{
        _id
        name
      }
    }
  }
}
`

export const UPDATE_ROLETEMPLATE=gql`
mutation CreateRoleTemplate($roleTemplate:RoleTemplateInput){
  response:updateRoleTemplate(roleTemplate:$roleTemplate){
    code
    message
  }
}
`

export const DELETE_ROLETEMPLATE=gql`
mutation DeleteRoleTemplate($_id:String!){
  response:deleteRoleTemplate(_id:$_id){
    code
    message
  }
}
`
export const QUERY_ROLETEMPLATE=gql`
query RoleTemplate($_id:String!){
  response:roleTemplate(_id:$_id){
    code
    message
    data{
      _id
      claims{
        type
        value
      }
      menuIds
      name
      menutrees{
        label:name
        value:_id
        children
        {
          label:name
          value:_id,
          children{
            label:name
            value:_id
          }
        }
      }
    }
  }
}
`
export const QUERY_ROLETEMPLATES =gql`
query ROleTemplates($page:Int,$pageSize:Int,$sorted:[SortedInput],$filtered:[FilteredInput]){
  response:roleTemplates(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered){
    code
    message
    data{
      _id
      claims{
        type
        value
      }
      menuIds
      name
      menutrees{
        label:name
        value:_id
        children
        {
          label:name
          value:_id,
          children{
            label:name
            value:_id
          }
        }
      }
    }
  }
}
`;


export const SUBCRIBE_NOTIFY=gql`
subscription($accessToken:String!){
  newNotifyEvent(accessToken:$accessToken){
    _id
    title
    shortDesc
    receivedTime
    option{
      linked
      type
    }
  }  
}
`
export const SUBCRIBE_ASTERISK = gql`
subscription Event($accessToken:String!){
    newInboundEvent(accessToken:$accessToken){
      callid
      atTime
      caller
      receiver
      atTime
      state
      customer{
        _id
        phoneNumber
        fullName
        birthDay
        address
        gender
        
      }
    }
  }
`


export const QUERY_EXTENSIONS=gql`
query Extensions($key:String,$extension:String){
  response:extensions(key:$key,extension:$extension){
    code
    message
    data{
      extension
      userName
      name
    }
  }
}
`;
export const CREATE_RINGGROUP=gql`
mutation CreateRingGroup($ringGroup:RingGroupInput){
  createRingGroup(ringGroup:$ringGroup){
    code
    message
  }
}
`

export const DELETE_RINGGROUP=gql`
mutation DeleteRingGroup($_id:String!){
  deleteRingGroup(_id:$_id){
    code
    message
  }
}
`;
export const QUERY_RINGGROUPS = gql`
query RingGroups{
  ringGroups {
    data{
      _id
      agents {
        _id
        userName
        extension
      }
      name      
      extensions
      createdTime
    }
  }
}
`;
export const QUERY_RINGGROUP=gql`
query RingGroup($_id:String!){
  response:ringGroup(_id:$_id){
    code
    message
    data{
      _id      
      agents {
        _id
        userName
      }
      extensions
      name
    }
  }
}
`;

export const CALLOUT = gql`
mutation Asterisk($phoneNumber:String!){
  callout(phoneNumber:$phoneNumber){
    code
    message
    data
  }
}
`;

export const CREATE_CUSTOMER=gql`
mutation CreateCustomer($customer:CustomerInput!){
  createCustomer(customer:$customer){
    code
    message
    data{
      _id
      address
      email
      fullName
      phoneNumber
    }
  }
}
`
export const UPDATE_CUSTOMER=gql`
mutation UpdateCustomer($customer:CustomerInput!){
  updateCustomer(customer:$customer){
    code
    message
    data{
      _id
      address
      email
      fullName
      phoneNumber
    }
  }
}
`
export const DELETE_CUSTOMER=gql`
mutation DeleteCustomer($_id:String!){
  response:deleteCustomer(_id:$_id){
    code
    message
    data{
      _id
    }
  }
}
`
export const DELETE_MENU=gql`
    mutation Mutation($_id:String!){
        deleteMenu(_id:$_id){
            code
            message
        }
    }
`

export const QUERY_MENUS=gql`
    query QueryMenus($filtered:[FilteredInput],$sorted:[SortedInput],$page:Int,$pageSize:Int){
        menus(page:$page,pageSize:$pageSize,filtered:$filtered,sorted:$sorted){
        data{
            _id
            name
            level
            description
            path
            sort
            disable
            icon
            slug
            parent{
                _id
                name
            }
            isAdmin
        }
        page
        pages
        }
    }
`;

export const UPDATE_APPOINTMENT_STATE=gql`
mutation UpdateState($_id:String!,$state:String!){
    updateAppointmentState(_id:$_id,state:$state){
      code
      message
      data{
        _id
      }
    }
  }
`;
export const FETCH_CDRS = gql`
query CDR($filtered:[FilteredInput],$sorted:[SortedInput],$page:Int,$pageSize:Int){
    response:cdrs(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered){
      code
      message
      page
      pages
      data{
        _id
        state
        receiver
        queueExten
        ringGroup{
          _id name
        }
        agent{name}
        customer{fullName phoneNumber}
        appointment{
          description
          updater{
            userName
          }
        }
        sender
        startTime
        ringTime
        upTime
        isOutbound
        did
        app
        duration
        endTime
        endReason
        hangupTime
        outboundCallerId
      }
    }
  }
`;

export const FETCH_CUSTOMERS = gql`
query Customer($page:Int,$pageSize:Int,$sorted:[SortedInput],$filtered:[FilteredInput]){
    customers(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered){
      page
      pages
      data{
        _id
        address
        birthDay
        fullName
        createdTime
        email
        gender
        phoneNumber     
        appointments
        servedAppointments 
      }
    }
  }
    
`
export const CREATE_APPOINTMENT = gql`
  mutation Mutation($appointment: AppointmentInput!,$callid:String) {
    data:createAppointment(appointment: $appointment,callid:$callid) {
      code
      message      
    }
  }
`;

export const FETCH_LIST_APPOINTMENT_HISTORY = gql`
  query Appointments(
    $filtered: [FilteredInput]
    $sorted: [SortedInput]
    $page: Int
    $pageSize: Int
  ) {
    appointments(
      page: $page
      pageSize: $pageSize
      sorted: $sorted
      filtered: $filtered
    ) {
      data {
        _id
        appointmentTime
        appointmentDate
        description
        phoneNumber
        chanel
        state
        department {
          _id
          name
        }
        createdTime        
        phoneNumber
        fullName
        gender  
      }
      page
      pages
    }
  }
`;
export const DELETE_APPOINTMENT=gql`
    mutation Mutation($_id:String!){
        deleteAppointment(_id:$_id){
            code
            message
        }
    }
`

export const FETCH_APPOINTMENT=gql`
  query Appointment($filtered:[FilteredInput],$sorted:[SortedInput],$page:Int,$pageSize:Int){
      appointments(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered){
      data{
          _id
          appointmentTime
          appointmentDate
          description
          reason
          chanel
          state
          phoneNumber
          fullName
          gender
          rePhoneNumber
          mariage
          birthDay
          changed
          changeReason
          departmentId
          department{
            _id
            name
          }
          createdTime
          customer{
          _id
            phoneNumber
            fullName
            gender
            birthDay 
          }
      }
      page
      pages
  }
}
  
`
export const FETCH_WORKING_TIME = gql`
  query Department($_id: String, $date: String) {
    department(_id: $_id) {
      code
      message
      data{
        workingTimes(date: $date) {
          timeRange
          remainProcess
        }
      }
    }
  }
`;
export const FETCH_DEPARTMENT = gql`
  query Department {
    departments {
      code
      message
      data{
        _id
        name
      }
    }
  }
`;
export const FETCH_CUSTOMER=gql`
query Customer($page:Int,$pageSize:Int,$sorted:[SortedInput],$filtered:[FilteredInput]){
    customers(page:$page,pageSize:$pageSize,sorted:$sorted,filtered:$filtered){
      page
      pages
      data{
        _id
        address
        birthDay
        fullName
        gender
        phoneNumber      
      }
    }
  }
    
`
export const GET_CUSTOMER = gql`
  query Customer($phoneNumber: String,$_id:String) {
    customer(phoneNumber: $phoneNumber,_id:$_id) {
      code
      message
      data{
        _id
        fullName
        address
        birthDay
        gender
        phoneNumber
        email
        patientId
        work
        gender
      }
    }
  }
`;
export const UPDATE_APPOINTMENT=gql`
    mutation Mutation($appointment:AppointmentInput!){
        updateAppointment(appointment:$appointment){
            code
            message
        }
    }
`