const fs = require("fs");
const Eos = require("eosjs");
const { ecc } = Eos.modules;

async function execute() {
  const [pub, wif] = [
    "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
    "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"
  ];
  const eos = Eos({
    keyProvider: wif
  });

  require("signale").info("start test case");
  wasm = fs.readFileSync("contracts/contentFeed/contentFeed.wasm");
  abi = fs.readFileSync("contracts/contentFeed/contentFeed.abi");

  const account = await eos.newaccount({
    creator: "eosio",
    name: "oldpa",
    owner: pub,
    active: pub
  });

  await eos.transaction(tr => {
    tr.setcode("oldpa", 0, 0, wasm);
    tr.setabi("oldpa", JSON.parse(abi));
  });

  require("signale").info("load contract");
  const instance = await eos.contract("oldpa");

  const data = [
    {
      feed: "mainfeed",
      data: {
        title: "Lynne Davy Parachute Jumping",
        aboutTitle: "Lynne Davy Parachute Jumping",
        aboutText:
          "I'm 100 on 27 July and doing a tandem jump for Great Ormond Street Hospital Children's Charity because since 1852 the staff have been changing lives",
        wallet: "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV"
      }
    },
    {
      feed: "storiesfeed",
      data:
        "Thanks for taking the time to visit my JustGiving page. I will be 100 years old on 27/07/2018. I have led  a full and interesting life in Africa and England. I have three children,  incredible grandchildren , great grandchildren and great great grandchildren. I was married to my beautiful wife Olive for over 70 years. I am not ready to give up the chance to have an adventure. Can’t think of anything more challenging than a tandem parachute jump!"
    },
    {
      feed: "storiesfeed",
      data:
        "I would love to know that reaching  this centennial, in good health, enables me to give back to children and their families by supporting the incredible work done by the staff of Great Ormond Street."
    },
    {
      feed: "storiesfeed",
      data:
        "Donating through JustGiving is simple, fast and totally secure. Your details are safe with JustGiving - they'll never sell them on or send unwanted emails. Once you donate, they'll send your money directly to the charity. So it's the most efficient way to donate - saving time and cutting costs for the charity."
    }
  ]
    .concat(
      [
        {
          name: "Timothe Chalamet",
          photo:
            "https://images-na.ssl-images-amazon.com/images/M/MV5BOWU1Nzg0M2ItYjEzMi00ODliLThkODAtNGEyYzRkZTBmMmEzXkEyXkFqcGdeQXVyNDk2Mzk2NDg@._V1_UY256_CR11,0,172,256_AL_.jpg"
        },
        {
          name: "Walter Franchetti",
          photo:
            "http://pbs.twimg.com/profile_images/964440531374764033/4o4KH4xe.jpg"
        },
        {
          name: "Matthew Modine",
          photo:
            "https://images-na.ssl-images-amazon.com/images/M/MV5BMTU3MzQyOTM5MF5BMl5BanBnXkFtZTgwNDg2Njk2OTE@._V1_UY256_CR7,0,172,256_AL_.jpg"
        },
        {
          name: "Annabella Sciorra",
          photo:
            "https://images-na.ssl-images-amazon.com/images/M/MV5BMTI0ODY5MzQ5N15BMl5BanBnXkFtZTYwOTY5MzA0._V1_UY256_CR0,0,172,256_AL_.jpg"
        },
        {
          name: "Evangeline Lilly",
          photo:
            "https://images-na.ssl-images-amazon.com/images/M/MV5BMTc2MDMzODU0OV5BMl5BanBnXkFtZTgwODIwOTAxMzI@._V1_UY256_CR25,0,172,256_AL_.jpg"
        },
        {
          name: "Idris Elba",
          photo:
            "https://images-na.ssl-images-amazon.com/images/M/MV5BNzEzMTI2NjEyNF5BMl5BanBnXkFtZTcwNTA0OTE4OA@@._V1_UX172_CR0,0,172,256_AL_.jpg"
        },
        {
          name: "oscar thomsen",
          photo: "https://randomuser.me/api/portraits/men/36.jpg"
        },
        {
          name: "Aniah Lassiter",
          photo: "https://d3iw72m71ie81c.cloudfront.net/female-55.jpeg"
        },
        {
          name: "Axel",
          photo:
            "http://pbs.twimg.com/profile_images/660106731129806848/o9djvppy.jpg"
        },
        {
          name: "Natalie Dormer",
          photo:
            "https://images-na.ssl-images-amazon.com/images/M/MV5BNjM4NjQwMzE1Ml5BMl5BanBnXkFtZTgwNjg5MTM0NzE@._V1_UX172_CR0,0,172,256_AL_.jpg"
        }
      ]
        .map((item, index) => {
          item.message = "Hello world!";
          item.amount = Math.floor(Math.random() * 100);

          const date = new Date();
          date.setDate(date.getDate() - index);
          item.date = date;

          return item;
        })
        .map(supporter => ({
          feed: "suppfeed",
          data: supporter
        }))
    )
    .concat(
      [
        {
          lines: `Time is moving and I am keeping up with exercise and walking much further now the weather is so good. Busy in my workshop and wanted to show you another of my hobbies 'Pyrography' this is a piece I am working on as a gift. 
Thank you so much for the continued support - I hope some folks will be at Go Skydive in Salisbury on the 28/07/2018 to see me jump!`.split(
            "\n"
          ),
          photo: "/images/photo-8.jpg"
        },
        {
          lines: `One of my hobbies is to do art on the I pad with a stylus and this one turned out well. The I pad has given me so much pleasure in many other ways too -  just another share to show life can be full if you stay interested. Thank you once again for the brilliant support for GOSH. Syd `.split(
            "\n"
          ),
          photo: "/images/photo-7.jpg"
        },
        {
          lines: `I thought I would show you I have invented an elastic leg excerciser - we used them during the war for rehab and I am managing to do 50 leg ups each side every day to make sure I am fit for the jump - my way of saying your generosity is appreciated by me staying strong!`.split(
            "\n"
          ),
          photo: "/images/photo-6.jpg"
        },
        {
          lines: `Hello today - we were quite emotional to see the incredible support for GOSH overnight. I will just keep saying thank you so very much. Your wonderful messages have really been taken to heart.
      A bit more of my life - here I am (bottom row left) with The Gold Coast Regiment in West Africa. `.split(
            "\n"
          ),
          photo: "/images/photo-5.jpg"
        },
        {
          lines: `The excitement is building as your generosity to GOSH serves to make what will be an exciting day even more worthwhile - so another 'thank you' ... to show a bit more of my life here I am (the highest bloke in the group) with my mates in the Artillery regiment during WW2`.split(
            "\n"
          ),
          photo: "/images/photo-4.jpg"
        },
        {
          lines: `Overwhelmed by the good wishes and generous donations to GOSH! Thank you.
Sharing a bit of my life - here I am with Olive ... we loved the simple life in Africa and cooking breakfast in the bush was top of our favourite things to do.`.split(
            "\n"
          ),
          photo: "/images/photo-3.jpg"
        },
        {
          lines: `What an incredible response. A truly huge thank you for your support to date! 
Warm regards
Bwana Syd`.split("\n"),
          photo: "/images/photo-2.jpg"
        }
      ]
        .map((post, index) => {
          const date = new Date();
          date.setDate(date.getDate() - index);
          post.date = date;

          return post;
        })
        .map(record => ({
          feed: "postsfeed",
          data: record
        }))
    )
    .concat([
      {
        feed: "mainfeed",
        data: {
          title: "Lynne Davy Parachute Jumping",
          aboutTitle: "Lynne Davy Parachute Jumping",
          aboutText:
            "I'm 100 on 27 July and doing a tandem jump for Great Ormond Street Hospital Children's Charity because since 1852 the staff have been changing lives",
          wallet: "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV"
        }
      }
    ])
    .concat([
      {
        feed: "storiesfeed",
        data:
          "Thanks for taking the time to visit my JustGiving page. I will be 100 years old on 27/07/2018. I have led  a full and interesting life in Africa and England. I have three children,  incredible grandchildren , great grandchildren and great great grandchildren. I was married to my beautiful wife Olive for over 70 years. I am not ready to give up the chance to have an adventure. Can’t think of anything more challenging than a tandem parachute jump!"
      },
      {
        feed: "storiesfeed",
        data:
          "I would love to know that reaching  this centennial, in good health, enables me to give back to children and their families by supporting the incredible work done by the staff of Great Ormond Street."
      },
      {
        feed: "storiesfeed",
        data:
          "Donating through JustGiving is simple, fast and totally secure. Your details are safe with JustGiving - they'll never sell them on or send unwanted emails. Once you donate, they'll send your money directly to the charity. So it's the most efficient way to donate - saving time and cutting costs for the charity."
      }
    ]);

  console.log(data);

  await Promise.all(
    data.map(async record => {
      const encodedData = JSON.stringify(record.data);
      return await instance.add(
        record.feed,
        "eosio",
        0,
        encodedData,
        ecc.signHash(ecc.sha256(encodedData), wif),
        {
          authorization: "eosio"
        }
      );
    })
  );
}

execute();
