<template>
	<breadCrumb ref="breadcrumb" :item='item'></breadCrumb>
	<!-- 首页外壳 -->
	<div class="home-wrapped">
		<!-- 轮播图外壳 -->
		<div class="swiper-wrapped">
			<el-carousel :interval="4000" indicator-position="outside" type="card" height="320px">
				<el-carousel-item v-for="(item,index) in imageUrl" :key="index">
					<img :src="item" class="swiper" alt=""/>
				</el-carousel-item>
			</el-carousel>
		</div>
		<!-- 栅格布局外壳 -->
		<div class="layout-wrapped">
			<el-row :gutter="20">
				<el-col :span="6" v-for="(item,index) in companyIntroduce" :key='index'   @click="openIntroduce(index+1)">
					<div class="company-message-area">
						<span>{{item.set_name}}</span>
						<div v-html='item.set_text' class="company-introduce"></div>
					</div>
				</el-col>
			</el-row>
		</div>
		<!-- 表格外壳 -->
		<div class="two-table-wrapped">
			<!-- 公司公告 -->
			<div class="company-notice">
				<span class="title">公司公告</span>
				<el-table :data="companyData" style="width: 100%" :show-header='false' @row-dblclick="openCompany">
					<el-table-column prop="message_title" label="公告主题">
						<template #default='{row}'>
							<div class="message_title">{{row.message_title}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="message_level" label="等级">
						<template #default='{row}'>
							<el-tag class="mx-1" round v-if="row.message_level=='一般'">{{row.message_level}}</el-tag>
							<el-tag type="warning" class="mx-1" round
								v-if="row.message_level=='重要'">{{row.message_level}}</el-tag>
							<el-tag type="danger" class="mx-1" round
								v-if="row.message_level=='必要'">{{row.message_level}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="message_publish_department" label="发布部门" />
					<el-table-column prop="message_publish_time" label="发布时间" width="200">
						<template #default="{row}">
							<div>{{row.message_publish_time?.slice(0,10)}}</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 系统消息 -->
			<div class="system-message">
				<span class="title">系统消息</span>
				<el-table :data="systemData" style="width: 100%" :show-header='false' @row-dblclick="openSystem">
					<el-table-column prop="message_title" label="公告主题"  />
					<el-table-column prop="message_publish_time" label="发布时间" width="200">
						<template #default="{row}">
							<div>{{row.message_publish_time?.slice(0,10)}}</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>

	</div>
	<introduce ref="intro"></introduce>
	<bulletin ref="bulletinDom"></bulletin>
</template>

<script lang="ts" setup>
	import { ref } from 'vue'
	import breadCrumb from '@/components/bread_crumb.vue'
	import { getAllSwiper, getAllCompanyIntroduce } from '@/api/setting'
	import { bus } from "@/utils/mitt.js"
	import introduce from './components/introduce.vue'
	import { companyMessageList,systemMessageList} from '@/api/message'
	import bulletin from '@/components/common_msg.vue'
	// 面包屑
	const breadcrumb = ref()
	// 面包屑参数
	const item = ref({
		first: '首页',
	})
	// 公司公告
	const companyData = ref()
	// 系统消息
	const systemData = ref()

	const getMessageList = async () =>{
		companyData.value = await companyMessageList()
		systemData.value = await systemMessageList()
	}
	getMessageList()
	// 轮播图
	const imageUrl = ref([])
	// 获取轮播图
	const allSwiper = async () => {
    imageUrl.value = await getAllSwiper() as any
	}
  allSwiper()

  interface CompanyDataType {
    id:number;
    set_name:string;
    set_value:string|null;
    set_text:any;
  }

	// 公司介绍
	const companyIntroduce= ref<CompanyDataType[]>([])
	const allCompanyIntroduce = async () => {
		const res = await getAllCompanyIntroduce() as any
		const [...intro] = res
		companyIntroduce.value = intro
	}
  allCompanyIntroduce()

	// 弹窗
	const intro = ref()
	const openIntroduce = (id : number) => {
		bus.emit('introduce', id)
		intro.value.open()
	}

	const bulletinDom:any = ref()
	const openCompany = (row:any) =>{
		bus.emit('homeCompany',row)
    bulletinDom.value.open()
	}

	const openSystem = (row:any) =>{
		bus.emit('homeSystem',row)
    bulletinDom.value.open()
	}
</script>

<style lang="scss" scoped>
	@mixin table-class {
		height: 232px;
		width: 48%;
		display: flex;
		flex-direction: column;

	}

	// 首页外壳
	.home-wrapped {
		padding: 8px;
		height: calc(100vh - 101px);
		background: #f5f5f5;
		display: flex;
		flex-direction: column;

		// 轮播图外壳
		.swiper-wrapped {
			padding: 0 20px;
			background: #fff;
			margin-bottom: 8px;

			.swiper {
				width: 100%;
				height: 100%;
			}
		}

		// 栅格布局外壳
		.layout-wrapped {
			padding: 8px;
			margin-bottom: 8px;
			background: #fff;

			// 公司信息区域
			.company-message-area {
				background: #f5f5f5;
				height: 200px;
				padding: 8px;
				cursor: pointer;

				span {
					border-bottom: 1px solid #409eff;
					font-size: 14px;
				}

				.company-introduce {
					text-indent: 24px;
					font-size: 14px;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 3;
					display: -webkit-box;
					-webkit-box-orient: vertical;
				}
			}

			.company-message-area:hover {
				cursor: pointer;
				background-color: #eef5ff;
			}
		}

		// 表格外壳
		.two-table-wrapped {
			height: 232px;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-around;
			background: #fff;



			// 公司公告
			.company-notice {
				@include table-class
			}

			// 系统消息
			.system-message {
				@include table-class
			}

			.title {
				font-size: 14px;
				margin-bottom: 5px;
				border-bottom: 1px solid #ea0709;
			}
		}
	}

	.message_title {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	// 轮播图默认样式
	.el-carousel__item h3 {
		color: #475669;
		opacity: 0.75;
		line-height: 200px;
		margin: 0;
		text-align: center;
	}

	.el-carousel__item:nth-child(2n) {
		background-color: #99a9bf;
	}

	.el-carousel__item:nth-child(2n + 1) {
		background-color: #d3dce6;
	}
</style>
